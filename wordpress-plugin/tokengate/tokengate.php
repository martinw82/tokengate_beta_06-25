<?php
/**
 * Plugin Name: TokenGate
 * Plugin URI: https://tokengate.example.com
 * Description: Gate your WordPress content based on cryptocurrency token ownership
 * Version: 1.0.0
 * Author: TokenGate
 * Author URI: https://tokengate.example.com
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: tokengate
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define plugin constants
define('TOKENGATE_VERSION', '1.0.0');
define('TOKENGATE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('TOKENGATE_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include admin settings
require_once TOKENGATE_PLUGIN_DIR . 'admin/class-tokengate-admin.php';

/**
 * Main plugin class
 */
class TokenGate {
    /**
     * The single instance of the class
     */
    protected static $_instance = null;

    /**
     * Admin class instance
     */
    public $admin = null;

    /**
     * Main plugin instance
     * 
     * @return TokenGate - Main instance
     */
    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Constructor
     */
    public function __construct() {
        $this->init_hooks();
        $this->admin = new TokenGate_Admin();
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('tokengate', array($this, 'tokengate_shortcode'));
    }

    /**
     * Enqueue scripts
     */
    public function enqueue_scripts() {
        // Enqueue PeraWallet for Algorand
        wp_enqueue_script('perawallet', 'https://unpkg.com/@perawallet/connect/dist/perawalletconnect.umd.js', array(), '1.3.3', true);
        
        // Enqueue Web3 for EVM chains
        wp_enqueue_script('web3', 'https://cdn.jsdelivr.net/npm/web3@1.8.1/dist/web3.min.js', array(), '1.8.1', true);
        
        // Enqueue TokenGate script
        wp_enqueue_script('tokengate-script', TOKENGATE_PLUGIN_URL . 'assets/js/tokengate.js', array('jquery', 'web3', 'perawallet'), TOKENGATE_VERSION, true);
        
        $api_url = get_option('tokengate_api_url', '');
        wp_localize_script('tokengate-script', 'tokengate_data', array(
            'api_url' => trailingslashit($api_url) . 'api/check-token',
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('tokengate-nonce')
        ));
        
        wp_enqueue_style('tokengate-style', TOKENGATE_PLUGIN_URL . 'assets/css/tokengate.css', array(), TOKENGATE_VERSION);
    }

    /**
     * TokenGate shortcode
     */
    public function tokengate_shortcode($atts, $content = null) {
        $atts = shortcode_atts(array(
            'network' => 'ethereum',
            'environment' => 'mainnet', // mainnet or testnet
            'token_address' => '',
            'token_type' => 'ERC-20',
            'min_balance' => '1000000000000000000', // 1 token with 18 decimals
            'token_id' => '',
            'action_type' => 'content',
            'redirect_url' => '',
            'message' => 'Congratulations! You have access to this content.'
        ), $atts, 'tokengate');
        
        // Generate unique ID for this gate
        $gate_id = 'tokengate-' . md5(serialize($atts) . $content);
        
        // Start output buffering
        ob_start();
        ?>
        <div class="tokengate-container" id="<?php echo esc_attr($gate_id); ?>" data-gate-id="<?php echo esc_attr($gate_id); ?>">
            <div class="tokengate-loading" style="display: none;">
                <div class="tokengate-spinner"></div>
                <p><?php esc_html_e('Connecting to wallet...', 'tokengate'); ?></p>
            </div>
            
            <div class="tokengate-connect">
                <div class="tokengate-message">
                    <p>
                        <?php 
                        if ($atts['environment'] === 'testnet') {
                            esc_html_e('This content requires testnet token ownership to view.', 'tokengate');
                        } else {
                            esc_html_e('This content requires token ownership to view.', 'tokengate');
                        }
                        ?>
                    </p>
                </div>
                <button class="tokengate-connect-button">
                    <?php 
                    if ($atts['network'] === 'algorand') {
                        esc_html_e('Connect Algorand Wallet', 'tokengate');
                    } else {
                        esc_html_e('Connect Wallet', 'tokengate');
                    }
                    ?>
                </button>
            </div>
            
            <div class="tokengate-content" style="display: none;">
                <?php echo do_shortcode($content); ?>
            </div>
            
            <div class="tokengate-error" style="display: none;">
                <p><?php esc_html_e('Access denied. You don\'t have the required token.', 'tokengate'); ?></p>
            </div>
        </div>
        
        <script type="text/javascript">
            document.addEventListener('DOMContentLoaded', function() {
                if (typeof TokenGate !== 'undefined') {
                    TokenGate.registerGate('<?php echo esc_js($gate_id); ?>', {
                        network: '<?php echo esc_js($atts['network']); ?>',
                        environment: '<?php echo esc_js($atts['environment']); ?>',
                        tokenAddress: '<?php echo esc_js($atts['token_address']); ?>',
                        tokenType: '<?php echo esc_js($atts['token_type']); ?>',
                        <?php if ($atts['token_type'] === 'ERC-20' || $atts['token_type'] === 'ASA'): ?>
                        minBalance: '<?php echo esc_js($atts['min_balance']); ?>',
                        <?php endif; ?>
                        <?php if (!empty($atts['token_id'])): ?>
                        tokenId: '<?php echo esc_js($atts['token_id']); ?>',
                        <?php endif; ?>
                        action: {
                            type: '<?php echo esc_js($atts['action_type']); ?>',
                            <?php if ($atts['action_type'] === 'redirect'): ?>
                            redirectUrl: '<?php echo esc_js($atts['redirect_url']); ?>'
                            <?php elseif ($atts['action_type'] === 'message'): ?>
                            message: '<?php echo esc_js($atts['message']); ?>'
                            <?php endif; ?>
                        }
                    });
                }
            });
        </script>
        <?php
        
        return ob_get_clean();
    }
}

// Initialize plugin
function TokenGate() {
    return TokenGate::instance();
}

// Start the plugin
TokenGate();
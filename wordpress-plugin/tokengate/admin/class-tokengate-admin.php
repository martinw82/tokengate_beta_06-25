<?php
/**
 * TokenGate admin class
 */
class TokenGate_Admin {
    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            __('TokenGate Settings', 'tokengate'),
            __('TokenGate', 'tokengate'),
            'manage_options',
            'tokengate',
            array($this, 'settings_page')
        );
    }

    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('tokengate_options', 'tokengate_api_url', array(
            'type' => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default' => ''
        ));
    }

    /**
     * Settings page
     */
    public function settings_page() {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <?php if (empty(get_option('tokengate_api_url'))): ?>
            <div class="notice notice-error">
                <p><?php _e('TokenGate API URL is not set. Token gating will not work until you set this.', 'tokengate'); ?></p>
            </div>
            <?php endif; ?>
            
            <form method="post" action="options.php">
                <?php
                settings_fields('tokengate_options');
                do_settings_sections('tokengate_options');
                ?>
                
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row"><?php _e('TokenGate API URL', 'tokengate'); ?></th>
                        <td>
                            <input type="url" name="tokengate_api_url" value="<?php echo esc_attr(get_option('tokengate_api_url')); ?>" class="regular-text" placeholder="https://your-tokengate-app.com" />
                            <p class="description"><?php _e('Enter the base URL where your TokenGate application is deployed.', 'tokengate'); ?></p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
            
            <div class="card">
                <h2><?php _e('How to Use TokenGate', 'tokengate'); ?></h2>
                <p><?php _e('Use the shortcode below to protect content on your site:', 'tokengate'); ?></p>
                <pre style="background: #f1f1f1; padding: 10px; overflow: auto;">[tokengate network="ethereum" token_address="0x123..." token_type="ERC-20" min_balance="1000000000000000000"]Your protected content here[/tokengate]</pre>
                
                <h3><?php _e('Shortcode Attributes', 'tokengate'); ?></h3>
                <ul style="list-style: disc; margin-left: 20px;">
                    <li><code>network</code> - Blockchain network: ethereum, polygon, or base</li>
                    <li><code>token_address</code> - Contract address of the token</li>
                    <li><code>token_type</code> - Token type: ERC-20, ERC-721, or ERC-1155</li>
                    <li><code>min_balance</code> - Minimum token balance (for ERC-20 tokens)</li>
                    <li><code>token_id</code> - Specific token ID (for ERC-721 or ERC-1155 tokens)</li>
                    <li><code>action_type</code> - Action type: content (default), message, or redirect</li>
                    <li><code>redirect_url</code> - URL to redirect to if access is denied</li>
                    <li><code>message</code> - Message to display if access is granted</li>
                </ul>
            </div>
        </div>
        <?php
    }
}
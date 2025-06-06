import React from 'react';
import { TokenGateAction } from '../types';

interface ActionConfigProps {
  action: TokenGateAction;
  onChange: (field: string, value: string) => void;
}

export const ActionConfig: React.FC<ActionConfigProps> = ({ action, onChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Action Configuration</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Access Denied Action
        </label>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="action-type"
              value="redirect"
              checked={action.type === 'redirect'}
              onChange={() => onChange('type', 'redirect')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
            />
            <span className="ml-2 text-gray-300">Redirect if NO token</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="action-type"
              value="message"
              checked={action.type === 'message'}
              onChange={() => onChange('type', 'message')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
            />
            <span className="ml-2 text-gray-300">Show message if token</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="action-type"
              value="content"
              checked={action.type === 'content'}
              onChange={() => onChange('type', 'content')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
            />
            <span className="ml-2 text-gray-300">Unlock HTML/content if token</span>
          </label>
        </div>
      </div>
      
      {action.type === 'redirect' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Redirect URL (if access denied)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/access-denied"
            value={action.redirectUrl}
            onChange={(e) => onChange('redirectUrl', e.target.value)}
          />
        </div>
      )}
      
      {action.type === 'message' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Success Message
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Congratulations! You have access to this content."
            value={action.message}
            onChange={(e) => onChange('message', e.target.value)}
          />
        </div>
      )}
      
      {action.type === 'content' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            HTML Content (visible only to token holders)
          </label>
          <textarea
            className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder="<div>This is premium content only visible to token holders!</div>"
            value={action.content}
            onChange={(e) => onChange('content', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
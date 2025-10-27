import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X, ChevronDown, ChevronUp, Terminal, AlertCircle } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'error' | 'warn' | 'success';
  message: string;
}

let logBuffer: LogEntry[] = [];

// Override console methods to capture logs
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

export function captureLog(level: 'info' | 'error' | 'warn' | 'success', ...args: any[]) {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
  
  logBuffer.push({
    timestamp: new Date().toLocaleTimeString(),
    level,
    message,
  });
  
  // Keep only last 50 logs
  if (logBuffer.length > 50) {
    logBuffer = logBuffer.slice(-50);
  }
  
  // Still call original console methods
  if (level === 'error') {
    originalConsoleError(...args);
  } else if (level === 'warn') {
    originalConsoleWarn(...args);
  } else {
    originalConsoleLog(...args);
  }
}

// Override console methods
console.log = (...args) => captureLog('info', ...args);
console.error = (...args) => captureLog('error', ...args);
console.warn = (...args) => captureLog('warn', ...args);

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend'>('frontend');
  const [backendLogs, setBackendLogs] = useState<string[]>([]);
  
  // Update logs every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs([...logBuffer]);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        style={{ zIndex: 9999 }}
      >
        <Terminal className="w-5 h-5" />
        Debug Console ({logs.length})
      </button>
    );
  }
  
  const errorCount = logs.filter(l => l.level === 'error').length;
  const warnCount = logs.filter(l => l.level === 'warn').length;
  
  return (
    <div 
      className="fixed bottom-4 right-4 z-[9999] bg-white border-2 border-gray-300 rounded-lg shadow-2xl"
      style={{ 
        zIndex: 9999,
        width: isMinimized ? '400px' : '600px',
        maxHeight: isMinimized ? '80px' : '500px',
      }}
    >
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          <span className="font-semibold">Debug Console</span>
          {errorCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {errorCount} errors
            </span>
          )}
          {warnCount > 0 && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              {warnCount} warnings
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-gray-700 p-1 rounded"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              logBuffer = [];
              setLogs([]);
            }}
            className="hover:bg-gray-700 px-2 py-1 rounded text-xs"
          >
            Clear
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-gray-700 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      {!isMinimized && (
        <div className="bg-gray-900 text-white p-4 overflow-y-auto font-mono text-xs rounded-b-lg" style={{ maxHeight: '400px' }}>
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No logs yet. Click test buttons to see debug output.
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded ${
                    log.level === 'error' 
                      ? 'bg-red-900/30 text-red-200 border-l-4 border-red-500' 
                      : log.level === 'warn'
                      ? 'bg-yellow-900/30 text-yellow-200 border-l-4 border-yellow-500'
                      : log.level === 'success'
                      ? 'bg-green-900/30 text-green-200 border-l-4 border-green-500'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 text-[10px] shrink-0">{log.timestamp}</span>
                    <span className="flex-1 whitespace-pre-wrap break-all">{log.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to log with specific level
export const debugLog = {
  info: (...args: any[]) => captureLog('info', ...args),
  error: (...args: any[]) => captureLog('error', ...args),
  warn: (...args: any[]) => captureLog('warn', ...args),
  success: (...args: any[]) => captureLog('success', ...args),
};
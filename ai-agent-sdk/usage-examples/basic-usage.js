#!/usr/bin/env node

/**
 * Basic usage example for testing the SDK locally
 * 
 * Usage:
 *   npm run example
 * 
 * Or with custom endpoint:
 *   ENDPOINT=wss://your-endpoint.com TOKEN=your-token npm run example
 */

import { AiAgent } from '../dist/index.js';

const endpoint = process.env.ENDPOINT || 'wss://api.egain.ai/agent';
const token = process.env.TOKEN || 'test-token';

console.log('🚀 Starting eGain AI Agent SDK Example');
console.log(`Endpoint: ${endpoint}`);
console.log(`Token: ${token.substring(0, 10)}...`);
console.log('');

const agent = new AiAgent({
  id: 'example-agent',
  endpoint,
  auth: { type: 'pre-auth', accessToken: token },
  autoConnect: false, // Manual connect for testing
});

// Event handlers
agent.on('connected', (event) => {
  const { timestamp, sessionId, agentId } = event;
  console.log('✅ Connected to agent');
});

agent.on('message', (event) => {
  const { payload: { data }, timestamp, sessionId, agentId } = event;
  console.log(`📨 Message received at ${new Date(timestamp).toISOString()}:`);
  console.log(JSON.stringify(data, null, 2));
});

agent.on('agentMessage', (event) => {
  const { payload: result, timestamp, sessionId, agentId } = event;
  console.log(`🤖 Agent message received at ${new Date(timestamp).toISOString()}:`);
  console.log(`   Content:`, result.message?.content || 'N/A');
});

agent.on('error', (event) => {
  const { payload: { error }, timestamp, sessionId, agentId } = event;
  console.error(`❌ Error at ${new Date(timestamp).toISOString()}:`, error.message);
});

agent.on('closed', (event) => {
  const { payload: { code, reason }, timestamp, sessionId, agentId } = event;
  console.log(`🔌 Connection closed at ${new Date(timestamp).toISOString()}`);
  console.log(`   Code: ${code}, Reason: ${reason || 'none'}`);
});

agent.on('stateChanged', (event) => {
  const { payload: { state, previousState }, timestamp, sessionId, agentId } = event;
  console.log(`🔄 State changed: ${previousState} → ${state}`);
});

agent.on('queueFlushed', (event) => {
  const { payload: { count }, timestamp, sessionId, agentId } = event;
  console.log(`📤 Queue flushed: ${count} messages sent at ${new Date(timestamp).toISOString()}`);
});

// Connect
console.log('Connecting...');
try {
  await agent.connect();
  
  // Wait a bit for connection
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (agent.isConnected()) {
    console.log('✅ Successfully connected!');
    console.log(`Current state: ${agent.getState()}`);
    console.log(`Queue size: ${agent.getQueueSize()}`);
    
    // Send a test message
    console.log('\nSending test message...');
    const messageId = await agent.send({
      text: 'Hello from SDK example!',
      timestamp: Date.now(),
    });
    console.log(`Message sent with ID: ${messageId}`);
    
    // Keep alive for a bit
    console.log('\nKeeping connection alive for 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\nDisconnecting...');
    await agent.disconnect();
  } else {
    console.log('❌ Failed to connect');
    console.log(`Current state: ${agent.getState()}`);
  }
} catch (error) {
  console.error('❌ Connection error:', error);
  process.exit(1);
}

console.log('\n✨ Example completed');


  



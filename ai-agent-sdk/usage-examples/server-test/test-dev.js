/**
 * Example test file for testing the SDK locally
 * 
 * Setup:
 *   1. In SDK directory: npm run build && npm run link
 *   2. In this directory: npm install && npm link @eGainDev/ai-agent-sdk
 *   3. Update ENDPOINT and TOKEN below
 *   4. Run: npm test
 */

// WebSocket polyfill is automatically loaded by the SDK
import { AiAgent } from '@eGainDev/ai-agent-sdk';

// Configuration - UPDATE THESE!
const ENDPOINT = process.env.ENDPOINT || 'https://eg5841ain.ezdev.net';
const TOKEN = process.env.TOKEN || 'your-token-here';
const AGENT_ID = process.env.AGENT_ID || '8812cecb-acf9-419a-b265-393884061666';


const agent = new AiAgent({
  id: AGENT_ID,
  endpoint: ENDPOINT,
  auth: { type: 'pre-auth', accessToken: TOKEN },
});

// Set up event listeners
agent.on('connected', (event) => {
  const { timestamp, sessionId, agentId } = event;
  console.log('✅ Connected successfully!');
  console.log(`   State: ${agent.getState()}`);
  console.log(`   Queue size: ${agent.getQueueSize()}`);
});

agent.on('message', (event) => {
  const { payload: { data }, timestamp, sessionId, agentId } = event;
  console.log(`📨 Message received:`);
  console.log(`   Time: ${new Date(timestamp).toISOString()}`);
  console.log(`   Data:`, JSON.stringify(data, null, 2));
});

agent.on('agentMessage', (event) => {
  const { payload: result, timestamp, sessionId, agentId } = event;
  console.log(`🤖 Agent message received:`);
  console.log(`   Time: ${new Date(timestamp).toISOString()}`);
  console.log(`   Content:`, result.message?.content || 'N/A');
});

agent.on('error', (event) => {
  const { payload: { error }, timestamp, sessionId, agentId } = event;
  console.error(`❌ Error:`);
  console.error(`   Time: ${new Date(timestamp).toISOString()}`);
  console.error(`   Message: ${error.message}`);
  if (error.stack) {
    console.error(`   Stack: ${error.stack}`);
  }
});

agent.on('closed', (event) => {
  const { payload: { code, reason }, timestamp, sessionId, agentId } = event;
  console.log(`🔌 Connection closed:`);
  console.log(`   Code: ${code}`);
  console.log(`   Reason: ${reason || 'none'}`);
  console.log(`   Time: ${new Date(timestamp).toISOString()}`);
});

agent.on('stateChanged', (event) => {
  const { payload: { state, previousState }, timestamp, sessionId, agentId } = event;
  console.log(`🔄 State changed: ${previousState} → ${state}`);
});

agent.on('queueFlushed', (event) => {
  const { payload: { count }, timestamp, sessionId, agentId } = event;
  console.log(`📤 Queue flushed: ${count} messages`);
  console.log(`   Time: ${new Date(timestamp).toISOString()}`);
});

// Test the SDK
async function runTests() {
  try {
    console.log('\n📋 Running tests...\n');

    // Test 1: Initial state
    console.log('Test 1: Check initial state');
    console.log(`   State: ${agent.getState()}`);
    console.log(`   Connected: ${agent.isConnected()}`);
    console.log(`   Queue size: ${agent.getQueueSize()}`);
    console.log('   ✅ Pass\n');

    // Test 2: Connect
    console.log('Test 2: Connect to endpoint');
    await agent.connect();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for connection
    console.log(`   State: ${agent.getState()}`);
    console.log(`   Connected: ${agent.isConnected()}`);
    if (agent.isConnected()) {
      console.log('   ✅ Pass\n');
    } else {
      console.log('   ⚠️  Connection may have failed (check endpoint/token)\n');
    }

    // Test 3: Send message (if connected)
    if (agent.isConnected()) {
      console.log('Test 3: Send message');
      try {
        const messageId = await agent.send({
          text: 'Test message from SDK',
          timestamp: Date.now(),
          test: true
        });
        console.log(`   Message ID: ${messageId}`);
        console.log('   ✅ Pass\n');
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}\n`);
      }
    }

    // Test 4: Queue message when offline
    console.log('Test 4: Queue message when offline');
    agent.disconnect();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const queuedId = await agent.send({
      text: 'Queued message',
      timestamp: Date.now()
    });
    console.log(`   Queued message ID: ${queuedId}`);
    console.log(`   Queue size: ${agent.getQueueSize()}`);
    console.log('   ✅ Pass\n');

    // Test 5: Reconnect and flush queue
    console.log('Test 5: Reconnect and flush queue');
    await agent.connect();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (agent.isConnected()) {
      console.log(`   Queue size after reconnect: ${agent.getQueueSize()}`);
      console.log('   ✅ Pass (queue should flush automatically)\n');
    }

    // Test 6: Clear queue
    console.log('Test 6: Clear queue');
    agent.clearQueue();
    console.log(`   Queue size: ${agent.getQueueSize()}`);
    console.log('   ✅ Pass\n');

    // Cleanup
    console.log('Cleaning up...');
    agent.disconnect();
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('\n✨ All tests completed!');
    console.log('\nNote: Some tests may show warnings if endpoint/token are invalid.');
    console.log('This is expected - update ENDPOINT and TOKEN to test with real server.');

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runTests();



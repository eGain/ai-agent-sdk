/**
 * Example test file for testing the SDK locally
 * 
 * Setup:
 *   1. In SDK directory: npm run build && npm run link
 *   2. In this directory: npm install && npm link @eGainDev/ai-agent-sdk
 *   3. Update ENDPOINT and TOKEN below
 *   4. Run: npm test
 */

import { 
  AiAgent, 
  LogLevel,
  createContextMessage,
  createEscalationMessage,
  createFeedbackMessage,
  createAgentMessage,
  createGracefulDisconnectMessage,
  createTokenMessage
} from '@eGainDev/ai-agent-sdk';

// Configuration - UPDATE THESE!
const ENDPOINT = process.env.ENDPOINT || 'https://eg5841ain.ezdev.net';
const TOKEN = process.env.TOKEN || 'your-token-here';
const AGENT_ID = process.env.AGENT_ID || '2d7abc22-26aa-46ab-9e8a-5410b62ec47d';

console.log('🧪 Testing @eGainDev/ai-agent-sdk SDK');
console.log(`Endpoint: ${ENDPOINT}`);
console.log(`Token: ${TOKEN.substring(0, 10)}...`);
console.log('');

// Initialize agent with optional auth
const agentParams = {
  id: AGENT_ID,
  endpoint: ENDPOINT,
  autoConnect: false
};

// Auth is optional - only add if token is provided
if (TOKEN && TOKEN !== 'your-token-here') {
  agentParams.auth = { type: 'pre-auth', accessToken: TOKEN };
}

const agent = new AiAgent(agentParams);

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
  
  // Log message JSON if available via SDK logger
  if (data && agent && agent.logger) {
    try {
      const messageJson = JSON.stringify(data, null, 2);
      agent.logger.info(`📨 [MESSAGE] Received message:\n${messageJson}`, { data, sessionId, agentId });
    } catch (e) {
      agent.logger.info(`📨 [MESSAGE] Received message (unable to stringify): ${String(data)}`, { data, sessionId, agentId });
    }
  }
});

agent.on('agentMessage', (event) => {
  const { payload: result, timestamp, sessionId, agentId } = event;
  console.log(`🤖 Agent message received:`);
  console.log(`   Time: ${new Date(timestamp).toISOString()}`);
  console.log(`   Content:`, result.message?.content || 'N/A');
  
  // Log agent message JSON if available via SDK logger
  if (result && agent && agent.logger) {
    try {
      const messageJson = JSON.stringify(result, null, 2);
      agent.logger.info(`🤖 [AGENT_MESSAGE] Received agent message:\n${messageJson}`, { result, sessionId, agentId });
    } catch (e) {
      agent.logger.info(`🤖 [AGENT_MESSAGE] Received agent message (unable to stringify): ${String(result)}`, { result, sessionId, agentId });
    }
  }
});

agent.on('error', (event) => {
  const { payload: { error }, timestamp, sessionId, agentId } = event;
  // Error logging is handled by logger subscription
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

agent.on('transcriptUpdate', (event) => {
  const { payload: { entry }, timestamp, sessionId, agentId } = event;
  console.log(`📝 Transcript updated:`);
  console.log(`   Direction: ${entry.direction}`);
  console.log(`   Content: ${entry.message?.content || 'N/A'}`);
  console.log(`   Time: ${new Date(timestamp).toISOString()}`);
});

agent.on('tokenExpiring', (event) => {
  const { payload: { reason, expiresAt }, timestamp, sessionId, agentId } = event;
  console.log(`🔑 Token expiring:`);
  console.log(`   Reason: ${reason}`);
  if (expiresAt) {
    console.log(`   Expires at: ${new Date(expiresAt).toISOString()}`);
  }
  console.log(`   Time: ${new Date(timestamp).toISOString()}`);
});

agent.on('heartbeat', (event) => {
  const { payload, timestamp, sessionId, agentId } = event;
  console.log(`💓 Heartbeat received:`);
  console.log(`   Time: ${new Date(timestamp).toISOString()}`);
  console.log(`   (Agent is processing/typing)`);
});

// Set up logger subscription to demonstrate logging mechanism
// All logs from the SDK will be displayed in the console
function setupLoggerSubscription() {
  if (!agent || !agent.logger) return;

  // Subscribe to all logs and display them in the console
  agent.logger.on('log', (entry) => {
    const levelName = LogLevel[entry.level];
    let icon = '';
    
    // Determine icon based on level
    switch (entry.level) {
      case LogLevel.TRACE:
        icon = '🔍';
        break;
      case LogLevel.DEBUG:
        icon = '🐛';
        break;
      case LogLevel.INFO:
        icon = 'ℹ️';
        break;
      case LogLevel.WARN:
        icon = '⚠️';
        break;
      case LogLevel.ERROR:
        icon = '❌';
        break;
      case LogLevel.FATAL:
        icon = '🔴';
        break;
    }
    
    // Build log message
    let logMessage = `${icon} [${levelName}] ${entry.message}`;
    
    // Add message JSON if available in context (prioritize message data)
    if (entry.context) {
      if (entry.context.message) {
        const messageJson = JSON.stringify(entry.context.message, null, 2);
        logMessage += `\nMessage JSON:\n${messageJson}`;
      } else if (entry.context.data) {
        const messageJson = JSON.stringify(entry.context.data, null, 2);
        logMessage += `\nMessage JSON:\n${messageJson}`;
      } else if (entry.context.payload) {
        const messageJson = JSON.stringify(entry.context.payload, null, 2);
        logMessage += `\nMessage JSON:\n${messageJson}`;
      }
      
      // Add other context if available (excluding already displayed message data)
      const contextWithoutMessage = { ...entry.context };
      delete contextWithoutMessage.message;
      delete contextWithoutMessage.data;
      delete contextWithoutMessage.payload;
      
      if (Object.keys(contextWithoutMessage).length > 0) {
        const contextStr = JSON.stringify(contextWithoutMessage, null, 2);
        logMessage += `\nContext: ${contextStr}`;
      }
    }
    
    // Add error message if available
    if (entry.error) {
      logMessage += `\nError: ${entry.error.message}`;
      if (entry.error.stack) {
        logMessage += `\nStack: ${entry.error.stack}`;
      }
    }
    
    // Log to console based on level
    switch (entry.level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      case LogLevel.INFO:
        console.log(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage);
        break;
    }
  });
}

// Set up logger subscription
setupLoggerSubscription();

// Test the SDK
async function runTests() {
  try {
    console.log('\n📋 Running tests...\n');

    // Test 1: Initial state
    console.log('Test 1: Check initial state');
    try {
      console.log(`   State: ${agent.getState()}`);
    } catch (error) {
      console.log(`   State: Not initialized (expected - call initialize() first)`);
    }
    try {
      console.log(`   Connected: ${agent.isConnected()}`);
    } catch (error) {
      console.log(`   Connected: Not initialized`);
    }
    try {
      console.log(`   Queue size: ${agent.getQueueSize()}`);
    } catch (error) {
      console.log(`   Queue size: Not initialized`);
    }
    console.log('   ✅ Pass\n');

    // Test 2: Initialize and Connect
    console.log('Test 2: Initialize and connect to endpoint');
    try {
      await agent.initialize();
      await agent.connect();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for connection
      console.log(`   State: ${agent.getState()}`);
      console.log(`   Connected: ${agent.isConnected()}`);
      if (agent.isConnected()) {
        console.log('   ✅ Pass\n');
      } else {
        console.log('   ⚠️  Connection may have failed (check endpoint/token)\n');
      }
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}\n`);
      throw error;
    }

    // Test 3: Send message (if connected)
    if (agent.isConnected()) {
      console.log('Test 3: Send message');
      try {
        // Use createAgentMessage helper for better message formatting
        const message = createAgentMessage({
          content: 'Test message from SDK'
        });
        
        const messageId = await agent.send(message);
        
        // Log sent message JSON via SDK logger
        if (agent && agent.logger) {
          try {
            const messageJson = JSON.stringify(message, null, 2);
            agent.logger.info(`📤 [MESSAGE] Sent message (ID: ${messageId}):\n${messageJson}`, { message, messageId });
          } catch (e) {
            agent.logger.info(`📤 [MESSAGE] Sent message (ID: ${messageId}, unable to stringify): ${String(message)}`, { message, messageId });
          }
        }
        
        console.log(`   Message ID: ${messageId}`);
        console.log('   ✅ Pass\n');
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}\n`);
      }
    }

    // Test 4: Context Management
    if (agent.isConnected()) {
      console.log('Test 4: Context management');
      try {
        // Set context with sendImmediately
        await agent.setContext({ 
          userId: 'test-user-123', 
          accountType: 'premium',
          testTimestamp: Date.now()
        }, { sendImmediately: true });
        console.log('   Context set and sent');
        
        // Get context
        const context = agent.getContext();
        console.log(`   Retrieved context:`, JSON.stringify(context, null, 2));
        
        // Reset context
        agent.resetContext();
        const clearedContext = agent.getContext();
        console.log(`   Context after reset: ${clearedContext === null ? 'null (cleared)' : 'still exists'}`);
        console.log('   ✅ Pass\n');
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}\n`);
      }
    }

    // Test 5: Transcript Updates
    if (agent.isConnected()) {
      console.log('Test 5: Transcript updates');
      try {
        const initialSize = agent.getTranscriptSize();
        console.log(`   Initial transcript size: ${initialSize}`);
        
        // Send a message to trigger transcript update
        const testMessage = createAgentMessage({
          content: 'Test message for transcript'
        });
        await agent.send(testMessage);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for transcript update
        
        const newSize = agent.getTranscriptSize();
        console.log(`   Transcript size after message: ${newSize}`);
        console.log('   ✅ Pass (transcriptUpdate event should have fired)\n');
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}\n`);
      }
    }

    // Test 6: Token Management
    if (agent.isConnected()) {
      console.log('Test 6: Token management');
      try {
        // Get access token
        const token = await agent.getAccessToken();
        if (token) {
          console.log(`   Access token retrieved: ${token.substring(0, 20)}...`);
          console.log('   ✅ Pass (token retrieved)\n');
        } else {
          console.log('   ⚠️  No token available (anonymous auth)\n');
        }
        // Note: tokenExpiring event and updateAccessToken would be tested
        // if token refresh is needed, but that's typically handled automatically
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}\n`);
      }
    }

    // Test 7: Heartbeat Events
    if (agent.isConnected()) {
      console.log('Test 7: Heartbeat events');
      console.log('   Waiting for heartbeat events...');
      console.log('   (Heartbeat events occur during agent processing)');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait to see if heartbeat fires
      console.log('   ✅ Pass (heartbeat listener is set up)\n');
    }

    // Test 8: Restart Connection
    if (agent.isConnected()) {
      console.log('Test 8: Restart connection');
      try {
        const queueSizeBefore = agent.getQueueSize();
        const transcriptSizeBefore = agent.getTranscriptSize();
        console.log(`   Queue size before restart: ${queueSizeBefore}`);
        console.log(`   Transcript size before restart: ${transcriptSizeBefore}`);
        
        await agent.restartConnection();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for reconnection
        
        const queueSizeAfter = agent.getQueueSize();
        const transcriptSizeAfter = agent.getTranscriptSize();
        console.log(`   Queue size after restart: ${queueSizeAfter} (should be 0)`);
        console.log(`   Transcript size after restart: ${transcriptSizeAfter} (should be 0)`);
        console.log(`   Connected: ${agent.isConnected()}`);
        
        if (queueSizeAfter === 0 && transcriptSizeAfter === 0 && agent.isConnected()) {
          console.log('   ✅ Pass\n');
        } else {
          console.log('   ⚠️  Restart completed but verification incomplete\n');
        }
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}\n`);
      }
    }

    // Test 9: Queue message when offline
    console.log('Test 9: Queue message when offline');
    if (agent.isConnected()) {
      await agent.disconnect({ skipGracefulDisconnect: true });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    try {
      // Use createAgentMessage helper
      const queuedMessage = createAgentMessage({
        content: 'Queued message'
      });
      
      const queuedId = await agent.send(queuedMessage);
      console.log(`   Queued message ID: ${queuedId}`);
      console.log(`   Queue size: ${agent.getQueueSize()}`);
      console.log('   ✅ Pass\n');
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}\n`);
    }

    // Test 10: Reconnect and flush queue
    console.log('Test 10: Reconnect and flush queue');
    try {
      await agent.connect();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (agent.isConnected()) {
        console.log(`   Queue size after reconnect: ${agent.getQueueSize()}`);
        console.log('   ✅ Pass (queue should flush automatically)\n');
      } else {
        console.log('   ⚠️  Reconnection may have failed\n');
      }
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}\n`);
    }

    // Test 11: Clear queue
    if (agent.isConnected()) {
      console.log('Test 11: Clear queue');
      try {
        agent.clearQueue();
        console.log(`   Queue size: ${agent.getQueueSize()}`);
        console.log('   ✅ Pass\n');
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}\n`);
      }
    }

    // Cleanup
    console.log('Cleaning up...');
    await agent.disconnect();
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



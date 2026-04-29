/**
 * Browser test for @eGainDev/ai-agent-sdk SDK
 * 
 * This file tests the SDK in a browser environment.
 * Make sure the SDK is built before testing.
 */

import { 
    AiAgent, 
    LogLevel,
    createContextMessage,
    createEscalationMessage,
    createFeedbackMessage,
    createAgentMessage,
    createGracefulDisconnectMessage
} from '@eGainDev/ai-agent-sdk';

let agent = null;
let stats = {
    messagesReceived: 0,
    messagesSent: 0,
    queueSize: 0
};

// DOM elements
const endpointInput = document.getElementById('endpoint');
const tokenInput = document.getElementById('token');
const agentIdInput = document.getElementById('agentId');
const logLevelSelect = document.getElementById('logLevel');
const createAgentBtn = document.getElementById('createAgentBtn');
const initializeAgentBtn = document.getElementById('initializeAgentBtn');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const restartBtn = document.getElementById('restartBtn');
const sendBtn = document.getElementById('sendBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const logContainer = document.getElementById('logContainer');
const queueSizeEl = document.getElementById('queueSize');
const messagesReceivedEl = document.getElementById('messagesReceived');
const messagesSentEl = document.getElementById('messagesSent');
const messageTextArea = document.getElementById('messageText');
const messageTypeSelect = document.getElementById('messageType');
const transcriptContainer = document.getElementById('transcriptContainer');
const clearTranscriptBtn = document.getElementById('clearTranscriptBtn');
const clearLogBtn = document.getElementById('clearLogBtn');
const getAgentDetailsBtn = document.getElementById('getAgentDetailsBtn');
const getDeploymentInfoBtn = document.getElementById('getDeploymentInfoBtn');
const getAccessTokenBtn = document.getElementById('getAccessTokenBtn');

// Logging functions
function log(message, type = 'info') {
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    
    // Convert newlines to <br> tags and escape HTML
    const escapedMessage = message
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    
    logEntry.innerHTML = `<span class="log-time">[${time}]</span>${escapedMessage}`;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function updateStatus(state) {
    statusText.textContent = state;
    statusIndicator.className = `status-indicator status-${state.toLowerCase()}`;
    
    // Update button states
    const isConnected = state === 'CONNECTED';
    const isConnecting = state === 'CONNECTING' || state === 'RECONNECTING';
    connectBtn.disabled = isConnected || isConnecting;
    disconnectBtn.disabled = !isConnected && !isConnecting;
    restartBtn.disabled = !isConnected && !isConnecting;
    sendBtn.disabled = !isConnected;
    // Disable initialize button when connected or connecting
    if (initializeAgentBtn) {
        initializeAgentBtn.disabled = isConnected || isConnecting || !agent;
    }
}

function updateStats() {
    queueSizeEl.textContent = stats.queueSize;
    messagesReceivedEl.textContent = stats.messagesReceived;
    messagesSentEl.textContent = stats.messagesSent;
}

// Add message to transcript
function addToTranscript(content, sender, timestamp, metadata = {}, rawData = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `transcript-message ${sender}`;
    
    const headerDiv = document.createElement('div');
    headerDiv.className = `message-header ${sender}`;
    headerDiv.textContent = sender === 'user' ? 'You' : (metadata.name || 'Agent');
    messageDiv.appendChild(headerDiv);
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble ${sender}`;
    
    // Handle different content types and render HTML
    if (typeof content === 'string') {
        bubbleDiv.innerHTML = content;
    } else if (content && typeof content === 'object') {
        // If it's a Message object with content property
        if (content.content) {
            bubbleDiv.innerHTML = content.content;
        } else if (content.text) {
            bubbleDiv.innerHTML = content.text;
        } else {
            bubbleDiv.textContent = JSON.stringify(content, null, 2);
        }
    } else {
        bubbleDiv.innerHTML = String(content);
    }
    
    messageDiv.appendChild(bubbleDiv);
    
    // Add timestamp
    const timeDiv = document.createElement('div');
    timeDiv.className = `message-time ${sender}`;
    const time = new Date(timestamp || Date.now());
    timeDiv.textContent = time.toLocaleTimeString();
    messageDiv.appendChild(timeDiv);
    
    // Add metadata if available
    if (metadata.role || metadata.persona) {
        const metaDiv = document.createElement('div');
        metaDiv.className = `message-meta ${sender}`;
        const metaParts = [];
        if (metadata.role) metaParts.push(`Role: ${metadata.role}`);
        if (metadata.persona) metaParts.push(`Persona: ${metadata.persona}`);
        metaDiv.textContent = metaParts.join(' • ');
        messageDiv.appendChild(metaDiv);
    }
    
    // Add collapsible raw JSON section if rawData is provided
    if (rawData !== null && rawData !== undefined) {
        const jsonContainer = document.createElement('div');
        jsonContainer.className = 'raw-json-container';
        
        // Create JSON content wrapper
        const jsonWrapper = document.createElement('div');
        jsonWrapper.className = 'raw-json-content-wrapper';
        
        // Create header with copy button
        const jsonHeader = document.createElement('div');
        jsonHeader.className = 'raw-json-header';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-json-btn';
        const copyBtnText = document.createElement('span');
        copyBtnText.className = 'copy-json-btn-text';
        copyBtnText.textContent = 'Copy';
        copyBtn.appendChild(copyBtnText);
        
        copyBtn.addEventListener('click', async () => {
            try {
                const jsonString = JSON.stringify(rawData, null, 2);
                await navigator.clipboard.writeText(jsonString);
                copyBtn.classList.add('copied');
                copyBtnText.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtnText.textContent = 'Copy';
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = JSON.stringify(rawData, null, 2);
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    copyBtn.classList.add('copied');
                    copyBtnText.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtnText.textContent = 'Copy';
                    }, 2000);
                } catch (e) {
                    console.error('Failed to copy:', e);
                }
                document.body.removeChild(textArea);
            }
        });
        
        jsonHeader.appendChild(copyBtn);
        jsonWrapper.appendChild(jsonHeader);
        
        const jsonContent = document.createElement('pre');
        jsonContent.className = 'raw-json-content';
        try {
            jsonContent.textContent = JSON.stringify(rawData, null, 2);
        } catch (e) {
            jsonContent.textContent = String(rawData);
        }
        
        jsonWrapper.appendChild(jsonContent);
        jsonContainer.appendChild(jsonWrapper);
        
        const toggleBtn = document.createElement('div');
        toggleBtn.className = `raw-json-toggle ${sender}`;
        toggleBtn.textContent = 'View Raw JSON';
        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.classList.contains('expanded');
            if (isExpanded) {
                toggleBtn.classList.remove('expanded');
                jsonContainer.classList.remove('expanded');
                toggleBtn.textContent = 'View Raw JSON';
            } else {
                toggleBtn.classList.add('expanded');
                jsonContainer.classList.add('expanded');
                toggleBtn.textContent = 'Hide Raw JSON';
            }
        });
        
        messageDiv.appendChild(toggleBtn);
        messageDiv.appendChild(jsonContainer);
    }
    
    transcriptContainer.appendChild(messageDiv);
    transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
}

// Create agent instance
function createAgent() {
    const endpoint = endpointInput.value.trim();
    const token = tokenInput.value.trim();
    const agentId = agentIdInput.value.trim();

    // Agent requires endpoint and id, so only initialize if both are provided
    if (!endpoint) {
        log('Please enter an endpoint URL', 'warning');
        return false;
    }
    
    if (!agentId) {
        log('Please enter an Agent ID', 'warning');
        return false;
    }

    // Disconnect existing agent if any
    if (agent) {
        disconnect();
    }

    try {
        // Auth is optional - only add if token is provided
        const params = {
            id: agentId,
            endpoint: endpoint,
            autoConnect: false,
            // Cache configuration for API calls
            cache: {
                enabled: true,
                storageType: 'session',  // 'local', 'session', or 'memory'
                ttl: 5 * 60 * 1000  // 5 minutes
            }
        };
        
        if (token) {
            params.auth = {
                type: 'pre-auth',
                accessToken: token
            };
            log(`Creating agent with pre-auth authentication...`, 'info');
        } else {
            log(`Creating agent with anonymous authentication...`, 'info');
        }
        
        // Set log level to TRACE for detailed debugging
        params.logLevel = LogLevel.TRACE;
        
        try {
            agent = new AiAgent(params);
            // Set up event handlers
            setupEventHandlers();
            
            // Update button states after agent creation
            if (createAgentBtn) createAgentBtn.disabled = true;
            if (initializeAgentBtn) initializeAgentBtn.disabled = false;
            if (connectBtn) connectBtn.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            if (getAgentDetailsBtn) getAgentDetailsBtn.disabled = false;
            if (getDeploymentInfoBtn) getDeploymentInfoBtn.disabled = false;
            if (getAccessTokenBtn) getAccessTokenBtn.disabled = false;
            
            log(`Agent created successfully (ID: ${agentId})`, 'success');
            return true;
        } catch (constructorError) {
            console.error('Constructor error:', constructorError);
            log(`Failed to create agent: ${constructorError.message}`, 'error');
            agent = null;
            return false;
        }
    } catch (error) {
        if (error.stack) {
            console.error('Initialization error stack:', error.stack);
        }
        log(`Error creating agent: ${error.message}`, 'error');
        agent = null;
        return false;
    }
}

// Initialize agent
async function initializeAgent() {
    if (!agent) {
        log('Agent not initialized. Please create agent first.', 'warning');
        return;
    }

    try {
        log('Initializing agent...', 'info');
        await agent.initialize();
        log('Agent initialized successfully', 'success');
        
        // Update button states after initialization
        if (initializeAgentBtn) initializeAgentBtn.disabled = true;
        if (connectBtn) connectBtn.disabled = false;
    } catch (error) {
        log(`Initialization failed: ${error.message}`, 'error');
        if (error.stack) {
            console.error('Initialization error stack:', error.stack);
        }
    }
}

// Connect to agent
async function connect() {
    // Only create agent if one doesn't exist
    if (!agent) {
        log('Agent not created. Creating agent first...', 'info');
        const created = createAgent();
        if (!created) {
            log('Failed to create agent. Please check your configuration.', 'error');
            return;
        }
    }

    try {
        updateStatus('CONNECTING');
        log('Connecting to agent...', 'info');

        // Try to connect - if connection not initialized, initialize first
        try {
            await agent.connect();
        } catch (connectError) {
            // If connection not initialized, initialize first then connect
            if (agent && connectError.message && connectError.message.includes('not initialized')) {
                log('Agent not initialized, initializing first...', 'info');
                await agent.initialize();
                await agent.connect();
            } else {
                throw connectError;
            }
        }
    } catch (error) {
        log(`Connection failed: ${error.message}`, 'error');
        if (error.stack) {
            console.error('Connection error stack:', error.stack);
        }
        updateStatus('CLOSED');
    }
};

// Disconnect from agent
async function disconnect() {
    if (agent) {
        await agent.disconnect();
        agent = null;
        updateStatus('CLOSED');
        log('Agent disconnected and destroyed', 'info');
        
        // Reset button states
        if (createAgentBtn) createAgentBtn.disabled = false;
        if (initializeAgentBtn) initializeAgentBtn.disabled = true;
        if (connectBtn) connectBtn.disabled = true;
        if (disconnectBtn) disconnectBtn.disabled = true;
        if (restartBtn) restartBtn.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
        if (getAgentDetailsBtn) getAgentDetailsBtn.disabled = true;
        if (getDeploymentInfoBtn) getDeploymentInfoBtn.disabled = true;
        if (getAccessTokenBtn) getAccessTokenBtn.disabled = true;
    }
};

// Restart connection
async function restart() {
    if (!agent) {
        console.warn('Agent not initialized. Cannot restart.');
        log('Cannot restart: Agent not initialized', 'warning');
        return;
    }

    try {
        updateStatus('CONNECTING');
        log('Restarting connection...', 'info');
        
        // Clear transcript and reset message stats
        transcriptContainer.innerHTML = '';
        stats.messagesReceived = 0;
        stats.messagesSent = 0;
        updateStats();
        log('Transcript cleared', 'info');
        
        await agent.restartConnection();
        log('Connection restarted successfully', 'success');
    } catch (error) {
        console.error('Restart error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        log(`Restart failed: ${errorMessage}`, 'error');
        if (agent) {
            try {
                const state = agent.getState();
                updateStatus(state);
            } catch {
                updateStatus('CLOSED');
            }
        } else {
            updateStatus('CLOSED');
        }
    }
};

// Send a message
async function sendMessage() {
    if (!agent) {
        console.warn('Not connected');
        return;
    }

    const messageText = messageTextArea.value.trim();
    if (!messageText) {
        console.warn('Please enter a message');
        return;
    }

    try {
        let message;
        let messageContent = '';
        const messageType = messageTypeSelect?.value || 'auto';
        
        try {
            const parsed = JSON.parse(messageText);
            
            // Use selected message type if not auto-detect
            if (messageType !== 'auto') {
                if (messageType === 'context') {
                    const payload = typeof parsed === "object" ? parsed : messageText;
                    message = createContextMessage({context: payload});
                    messageContent = `[Context] ${payload.context || messageText}`;
                } else if (messageType === 'escalation') {
                    message = createEscalationMessage({ 
                        escalationEvent: parsed.escalationEvent || parsed,
                        ...(parsed.messageId && { messageId: parsed.messageId }),
                        ...(parsed.from && { from: parsed.from }),
                        ...(parsed.to && { to: parsed.to })
                    });
                    messageContent = `[Escalation] ${JSON.stringify(parsed.escalationEvent || parsed)}`;
                } else if (messageType === 'feedback') {
                    message = createFeedbackMessage({ 
                        rating: parsed.rating || parsed.ratingValue,
                        answerMessageId: parsed.answerMessageId || parsed.messageId || '',
                        ...(parsed.messageId && { messageId: parsed.messageId }),
                        ...(parsed.from && { from: parsed.from }),
                        ...(parsed.to && { to: parsed.to })
                    });
                    messageContent = `[Feedback] Rating: ${parsed.rating || parsed.ratingValue}, Message ID: ${parsed.answerMessageId || parsed.messageId}`;
                } else if (messageType === 'graceful-disconnect') {
                    message = createGracefulDisconnectMessage({
                        ...(parsed.messageId && { messageId: parsed.messageId }),
                        ...(parsed.from && { from: parsed.from }),
                        ...(parsed.to && { to: parsed.to })
                    });
                    messageContent = '[Graceful Disconnect]';
                } else if (messageType === 'agent') {
                    message = createAgentMessage({
                        content: parsed.content || messageText,
                        ...(parsed.persona && { persona: parsed.persona }),
                        ...(parsed.role && { role: parsed.role }),
                        ...(parsed.messageId && { messageId: parsed.messageId }),
                        ...(parsed.from && { from: parsed.from }),
                        ...(parsed.to && { to: parsed.to })
                    });
                    messageContent = parsed.content || messageText;
                } else {
                    message = parsed;
                    messageContent = parsed.content || parsed.text || JSON.stringify(parsed);
                }
            } else if (parsed.type === 'context' && parsed.context) {
                // Auto-detect: Check if it's a structured message type and use appropriate helper
                // Context message
                message = createContextMessage({ 
                    context: parsed.context,
                    ...(parsed.messageId && { messageId: parsed.messageId }),
                    ...(parsed.from && { from: parsed.from }),
                    ...(parsed.to && { to: parsed.to })
                });
                messageContent = `[Context] ${parsed.context}`;
            } else if (parsed.type === 'escalation' && parsed.escalationEvent) {
                // Escalation message
                message = createEscalationMessage({ 
                    escalationEvent: parsed.escalationEvent,
                    ...(parsed.messageId && { messageId: parsed.messageId }),
                    ...(parsed.from && { from: parsed.from }),
                    ...(parsed.to && { to: parsed.to })
                });
                messageContent = `[Escalation] ${JSON.stringify(parsed.escalationEvent)}`;
            } else if (parsed.type === 'feedback' && parsed.rating !== undefined && parsed.answerMessageId) {
                // Feedback message
                message = createFeedbackMessage({ 
                    rating: parsed.rating,
                    answerMessageId: parsed.answerMessageId,
                    ...(parsed.messageId && { messageId: parsed.messageId }),
                    ...(parsed.from && { from: parsed.from }),
                    ...(parsed.to && { to: parsed.to })
                });
                messageContent = `[Feedback] Rating: ${parsed.rating}, Message ID: ${parsed.answerMessageId}`;
            } else if (parsed.type === 'graceful-disconnect') {
                // Graceful disconnect message
                message = createGracefulDisconnectMessage({
                    ...(parsed.messageId && { messageId: parsed.messageId }),
                    ...(parsed.from && { from: parsed.from }),
                    ...(parsed.to && { to: parsed.to })
                });
                messageContent = '[Graceful Disconnect]';
            } else if (parsed.persona && parsed.role) {
                // Already formatted message object (backward compatibility)
                message = parsed;
                messageContent = parsed.content || parsed.text || JSON.stringify(parsed);
            } else if (parsed.content) {
                // Simple object with content - use createAgentMessage
                message = createAgentMessage({
                    content: parsed.content,
                    ...(parsed.persona && { persona: parsed.persona }),
                    ...(parsed.role && { role: parsed.role }),
                    ...(parsed.messageId && { messageId: parsed.messageId }),
                    ...(parsed.from && { from: parsed.from }),
                    ...(parsed.to && { to: parsed.to })
                });
                messageContent = parsed.content;
            } else {
                // Fallback: use as-is
                message = parsed;
                messageContent = parsed.text || parsed.content || JSON.stringify(parsed);
            }
        } catch {
            // If not valid JSON, treat as plain text
            if (messageType === 'context') {
                message = createContextMessage({ context: messageText });
                messageContent = `[Context] ${messageText}`;
            } else if (messageType === 'escalation') {
                message = createEscalationMessage({ escalationEvent: { message: messageText } });
                messageContent = `[Escalation] ${messageText}`;
            } else if (messageType === 'feedback') {
                // For feedback, we need rating and answerMessageId - use defaults or show error
                console.warn('Feedback requires rating and answerMessageId. Using defaults.');
                message = createFeedbackMessage(JSON.parse(messageText));
                messageContent = `[Feedback] ${messageText}`;
            } else if (messageType === 'graceful-disconnect') {
                message = createGracefulDisconnectMessage();
                messageContent = '[Graceful Disconnect]';
            } else {
                // Default to agent message
                message = createAgentMessage({ content: messageText });
                messageContent = messageText;
            }
        }
        
        const messageId = await agent.send(message);
        stats.messagesSent++;
        updateStats();
        
        // Log sent message JSON via SDK logger
        if (agent && agent.logger) {
            try {
                const messageJson = JSON.stringify(message, null, 2);
                agent.logger.info(`📤 [MESSAGE] Sent message (ID: ${messageId}):\n${messageJson}`, { message, messageId });
            } catch (e) {
                agent.logger.info(`📤 [MESSAGE] Sent message (ID: ${messageId}, unable to stringify): ${String(message)}`, { message, messageId });
            }
        }
        
        // Add sent message to transcript with raw data
        addToTranscript(messageContent, 'user', Date.now(), {
            persona: message.persona,
            role: message.role
        }, message);
        
        messageTextArea.value = '';
    } catch (error) {
        console.error('Send error:', error);
    }
};

// Clear log
function clearLog() {
    logContainer.innerHTML = '';
};

// Clear transcript
function clearTranscript() {
    transcriptContainer.innerHTML = '';
};

// Get agent details from SDK
async function fetchAgentDetails() {
    if (!agent) {
        console.warn('Agent not initialized');
        log('Cannot get agent details: Agent not initialized', 'warning');
        return;
    }

    try {
        log('Fetching agent details...', 'info');
        const agentDetails = await agent.getAgentDetails();
        console.log('Agent Details:', agentDetails);
        
        if (agentDetails) {
            log(`Agent Details retrieved. Check browser console for full details.`, 'success');
            // Also log a formatted summary
            const summary = {
                name: agentDetails.name || agentDetails.agentProfileDetails?.name,
                id: agentDetails.agentId || agentDetails.id,
                // Include a few key fields
                ...agentDetails
            };
            console.log('Agent Details (formatted):', JSON.stringify(summary, null, 2));
        } else {
            log('Agent details not available. Make sure to connect first or check authentication.', 'warning');
        }
    } catch (error) {
        console.error('Error getting agent details:', error);
        log(`Error getting agent details: ${error.message}`, 'error');
    }
};

// Get deployment info from SDK
async function fetchDeploymentInfo() {
    if (!agent) {
        console.warn('Agent not initialized');
        log('Cannot get deployment info: Agent not initialized', 'warning');
        return;
    }

    try {
        log('Fetching deployment info...', 'info');
        const deploymentInfo = await agent.getDeploymentInfo();
        console.log('Deployment Info:', deploymentInfo);
        
        if (deploymentInfo) {
            log(`Deployment Info retrieved. Check browser console for full details.`, 'success');
            // Also log a formatted summary
            console.log('Deployment Info (formatted):', JSON.stringify(deploymentInfo, null, 2));
        } else {
            log('Deployment info not available.', 'warning');
        }
    } catch (error) {
        console.error('Error getting deployment info:', error);
        log(`Error getting deployment info: ${error.message}`, 'error');
    }
}

// Get access token
async function fetchAccessToken() {
    if (!agent) {
        console.warn('Agent not initialized');
        log('Cannot get access token: Agent not initialized', 'warning');
        return;
    }

    try {
        log('Fetching access token...', 'info');
        const accessToken = await agent.getAccessToken();
        
        if (accessToken) {
            console.log('Access Token:', accessToken);
            log(`Access token retrieved. Check browser console for the token.`, 'success');
            // Log a masked version in the UI (show first 20 chars and last 10 chars)
            const maskedToken = accessToken.length > 30 
                ? `${accessToken.substring(0, 20)}...${accessToken.substring(accessToken.length - 10)}`
                : '***';
            log(`Access Token (masked): ${maskedToken}`, 'info');
        } else {
            console.log('Access Token: null');
            log('No access token available (null).', 'warning');
        }
    } catch (error) {
        console.error('Error getting access token:', error);
        log(`Error getting access token: ${error.message}`, 'error');
    }
};

// Set up event handlers
function setupEventHandlers() {
    if (!agent) return;

    agent.on('connected', (event) => {
        const { timestamp, sessionId, agentId } = event;
        updateStatus('CONNECTED');
        stats.queueSize = agent.getQueueSize();
        updateStats();
    });

    agent.on('message', (event) => {
        const { payload: { data }, timestamp, sessionId, agentId } = event;
        stats.messagesReceived++;
        updateStats();
        
        // Log message JSON if available via SDK logger
        if (data && agent && agent.logger) {
            try {
                const messageJson = JSON.stringify(data, null, 2);
                agent.logger.info(`📨 [MESSAGE] Received message:\n${messageJson}`, { data, sessionId, agentId });
            } catch (e) {
                agent.logger.info(`📨 [MESSAGE] Received message (unable to stringify): ${String(data)}`, { data, sessionId, agentId });
            }
        }
        
        // Don't add agent messages to transcript here - they're handled by 'agentMessage' event
        // This handler is for logging and non-agent messages only
    });

    agent.on('agentMessage', (event) => {
        const { payload: result, timestamp, sessionId, agentId } = event;
        
        // Log agent message JSON if available via SDK logger
        if (result && agent && agent.logger) {
            try {
                const messageJson = JSON.stringify(result, null, 2);
                agent.logger.info(`🤖 [AGENT_MESSAGE] Received agent message:\n${messageJson}`, { result, sessionId, agentId });
            } catch (e) {
                agent.logger.info(`🤖 [AGENT_MESSAGE] Received agent message (unable to stringify): ${String(result)}`, { result, sessionId, agentId });
            }
        }
        
        // Handle structured agent messages
        if (result && result.message) {
            addToTranscript(
                result.message.content,
                'agent',
                timestamp || Date.now(),
                {
                    name: result.from?.name || 'Agent',
                    role: result.message.role,
                    persona: result.message.persona
                },
                { ...result, timestamp, sessionId, agentId }
            );
        }
    });

    agent.on('error', (event) => {
        const { payload: { error }, timestamp, sessionId, agentId } = event;
        // Error logging is handled by logger subscription
        if (error.stack) {
            console.error('Error stack:', error.stack);
        }
    });

    agent.on('closed', (event) => {
        const { payload: { code, reason }, timestamp, sessionId, agentId } = event;
        updateStatus('CLOSED');
    });

    agent.on('stateChanged', (event) => {
        const { payload: { state, previousState }, timestamp, sessionId, agentId } = event;
        updateStatus(state);
        if (agent) {
            stats.queueSize = agent.getQueueSize();
            updateStats();
        }
    });

    agent.on('queueFlushed', (event) => {
        const { payload: { count }, timestamp, sessionId, agentId } = event;
        stats.queueSize = agent.getQueueSize();
        updateStats();
    });

    // Subscribe to logger events - demonstrate logging subscription
    setupLoggerSubscription();
}

// Set up logger subscription to demonstrate logging mechanism
// All logs from the SDK will be displayed in the Event log window
function setupLoggerSubscription() {
    if (!agent || !agent.logger) return;

    // Subscribe to all logs and display them in the Event log window
    agent.logger.on('log', (entry) => {
        const levelName = LogLevel[entry.level];
        let icon = '';
        let logType = 'info';
        
        // Determine icon and log type based on level
        switch (entry.level) {
            case LogLevel.TRACE:
                icon = '🔍';
                logType = 'info';
                break;
            case LogLevel.DEBUG:
                icon = '🐛';
                logType = 'info';
                break;
            case LogLevel.INFO:
                icon = 'ℹ️';
                logType = 'info';
                break;
            case LogLevel.WARN:
                icon = '⚠️';
                logType = 'warning';
                break;
            case LogLevel.ERROR:
                icon = '❌';
                logType = 'error';
                break;
            case LogLevel.FATAL:
                icon = '🔴';
                logType = 'error';
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
        
        // Log to Event log window
        log(logMessage, logType);
        
        // Also log to console for DEBUG and TRACE levels
        if (entry.level === LogLevel.DEBUG || entry.level === LogLevel.TRACE) {
            console.debug(`[${levelName}] ${entry.message}`, entry.context || {});
        }
    });
}

// Update log level dynamically
function updateLogLevel() {
    if (agent && agent.logger) {
        const selectedLogLevel = parseInt(logLevelSelect.value, 10);
        agent.logger.setLevel(selectedLogLevel);
        const levelName = LogLevel[selectedLogLevel];
        agent.logger.info(`Log level changed to ${levelName}`, { logLevel: selectedLogLevel, levelName });
    }
}

// Set up button event listeners
if (createAgentBtn) {
    createAgentBtn.addEventListener('click', createAgent);
}
if (initializeAgentBtn) {
    initializeAgentBtn.addEventListener('click', initializeAgent);
}
connectBtn.addEventListener('click', connect);
disconnectBtn.addEventListener('click', disconnect);
restartBtn.addEventListener('click', restart);
if (clearLogBtn) {
    clearLogBtn.addEventListener('click', clearLog);
}
if (clearTranscriptBtn) {
    clearTranscriptBtn.addEventListener('click', clearTranscript);
}
if (getAgentDetailsBtn) {
    getAgentDetailsBtn.addEventListener('click', fetchAgentDetails);
}
if (getDeploymentInfoBtn) {
    getDeploymentInfoBtn.addEventListener('click', fetchDeploymentInfo);
}
if (getAccessTokenBtn) {
    getAccessTokenBtn.addEventListener('click', fetchAccessToken);
}
sendBtn.addEventListener('click', sendMessage);

// Update log level when selection changes
logLevelSelect.addEventListener('change', updateLogLevel);

// Initialize
// Agent is now created manually via the "Create Agent" button
log('Ready. Click "Create Agent" to initialize the SDK.', 'info');

// Allow Enter key to send message (Shift+Enter for new line)
messageTextArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Update queue size periodically
setInterval(() => {
    if (agent) {
        const currentQueueSize = agent.getQueueSize();
        if (currentQueueSize !== stats.queueSize) {
            stats.queueSize = currentQueueSize;
            updateStats();
        }
    }
}, 500);


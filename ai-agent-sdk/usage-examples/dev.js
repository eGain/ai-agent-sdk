import { AiAgent } from '../dist/index.js';

const endpoint = "https://eg5841ain.ezdev.net";
const agentId = "8812cecb-acf9-419a-b265-393884061666";
const token = process.env.TOKEN || 'test-token';

const agent = new AiAgent({
  id: agentId,
  endpoint: endpoint,
  auth: { type: 'pre-auth', accessToken: token },
  autoConnect: false, // Manual connect for testing
});


const axios = require('axios');
const config = require('../config');

const ADMIN_GROUP = 'neurohub_pro/openwebui-admin';

async function getUser(email) {
  const { data } = await axios.get(`${config.casdoor.endpoint}/api/get-user`, {
    params: {
      email,
      clientId: config.casdoor.clientId,
      clientSecret: config.casdoor.clientSecret,
    },
  });
  // Casdoor wraps user in { status, data: { ...user } }
  const user = data.data || data;
  console.log(`Casdoor getUser(${email}):`, user.name || 'not found');
  return user;
}

/**
 * Update user groups in Casdoor.
 * Preserves admin group if user already has it.
 */
async function updateUserGroup(email, newGroup) {
  const user = await getUser(email);
  if (!user || !user.name) {
    console.warn(`Casdoor user not found for email: ${email}`);
    return null;
  }

  if (!user.displayName || user.displayName.trim() === '') {
    user.displayName = user.email;
  }

  const currentGroups = user.groups || [];
  const hasAdmin = currentGroups.includes(ADMIN_GROUP);

  const newGroups = [];
  if (hasAdmin) newGroups.push(ADMIN_GROUP);
  newGroups.push(newGroup);
  user.groups = [...new Set(newGroups)];

  const { data } = await axios.post(
    `${config.casdoor.endpoint}/api/update-user`,
    user,
    {
      params: {
        id: `neurohub_pro/${user.name}`,
        clientId: config.casdoor.clientId,
        clientSecret: config.casdoor.clientSecret,
      },
    }
  );
  return data;
}

module.exports = {
  getUser,
  updateUserGroup,
};

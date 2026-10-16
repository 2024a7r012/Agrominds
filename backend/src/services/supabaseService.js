const { supabase, supabaseAdmin, isConfigured } = require('../config/supabase');
const logger = require('../config/logger');

// Local in-memory repository for development fallback
const memoryDb = {
  profiles: new Map([
    [
      '00000000-0000-0000-0000-000000000001',
      {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'farmer.demo@agrominds.org',
        full_name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        role: 'farmer',
        farm_size_acres: 12.5,
        primary_crops: ['Wheat', 'Mustard', 'Paddy'],
        soil_type: 'Alluvial Loam',
        state_region: 'Haryana / Punjab Border',
        created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
      }
    ]
  ]),
  conversations: new Map([
    [
      'conv-demo-1',
      {
        id: 'conv-demo-1',
        user_id: '00000000-0000-0000-0000-000000000001',
        title: 'Wheat Sowing & First Irrigation Schedule',
        crop_context: 'Wheat',
        soil_context: 'Alluvial Loam',
        location_context: 'Haryana',
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
      }
    ]
  ]),
  messages: new Map([
    [
      'msg-demo-1',
      {
        id: 'msg-demo-1',
        conversation_id: 'conv-demo-1',
        sender: 'user',
        content: 'When is the best time to apply the first irrigation to timely sown wheat in alluvial soil?',
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
      }
    ],
    [
      'msg-demo-2',
      {
        id: 'msg-demo-2',
        conversation_id: 'conv-demo-1',
        sender: 'assistant',
        content: 'For timely sown wheat, the first irrigation is crucial at the Crown Root Initiation (CRI) stage, typically between 20 to 25 days after sowing. Applying it too late reduces tillering and overall yield.',
        is_mock: true,
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000 + 5000).toISOString()
      }
    ]
  ])
};

class SupabaseService {
  /**
   * Get user profile by ID
   */
  async getProfile(userId) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          logger.warn('Failed to fetch profile from Supabase:', { error: error.message });
          return null;
        }
        return data;
      } catch (err) {
        logger.error('Supabase profile query exception:', { error: err.message });
      }
    }

    return memoryDb.profiles.get(userId) || null;
  }

  /**
   * Update or upsert user profile
   */
  async updateProfile(userId, profileData) {
    const sanitized = {
      full_name: profileData.full_name,
      phone: profileData.phone,
      role: profileData.role,
      farm_size_acres: profileData.farm_size_acres,
      primary_crops: profileData.primary_crops,
      soil_type: profileData.soil_type,
      state_region: profileData.state_region,
      updated_at: new Date().toISOString()
    };

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .update(sanitized)
          .eq('id', userId)
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        logger.error('Supabase profile update error:', { error: err.message });
      }
    }

    // Fallback in-memory
    const existing = memoryDb.profiles.get(userId) || { id: userId, email: 'user@agrominds.local' };
    const updated = { ...existing, ...sanitized };
    memoryDb.profiles.set(userId, updated);
    return updated;
  }

  /**
   * List conversations for user
   */
  async getUserConversations(userId) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!error && data) return data;
      } catch (err) {
        logger.error('Supabase list conversations error:', { error: err.message });
      }
    }

    const convs = Array.from(memoryDb.conversations.values())
      .filter((c) => c.user_id === userId)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return convs;
  }

  /**
   * Create new conversation
   */
  async createConversation(userId, { title, crop_context, soil_context, location_context }) {
    const newConv = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      title: title || 'Agricultural Advisory Session',
      crop_context: crop_context || null,
      soil_context: soil_context || null,
      location_context: location_context || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .insert([newConv])
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        logger.error('Supabase create conversation error:', { error: err.message });
      }
    }

    memoryDb.conversations.set(newConv.id, newConv);
    return newConv;
  }

  /**
   * Get messages for conversation
   */
  async getMessages(conversationId) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (!error && data) return data;
      } catch (err) {
        logger.error('Supabase get messages error:', { error: err.message });
      }
    }

    return Array.from(memoryDb.messages.values())
      .filter((m) => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  /**
   * Add message to conversation
   */
  async addMessage(conversationId, { sender, content, is_mock = false }) {
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversation_id: conversationId,
      sender,
      content,
      is_mock,
      created_at: new Date().toISOString()
    };

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert([newMsg])
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        logger.error('Supabase add message error:', { error: err.message });
      }
    }

    memoryDb.messages.set(newMsg.id, newMsg);

    // Update conversation updated_at
    const conv = memoryDb.conversations.get(conversationId);
    if (conv) {
      conv.updated_at = new Date().toISOString();
    }

    return newMsg;
  }
}

module.exports = new SupabaseService();

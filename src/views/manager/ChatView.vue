<template>
  <div class="chat">
    <div class="header">
      <h1>المحادثة</h1>
    </div>

    <div class="chat-container">
      <!-- قائمة القنوات -->
      <div class="channels">
        <h3>القنوات</h3>
        <div
          v-for="channel in channels"
          :key="channel"
          :class="['channel-item', activeChannel === channel ? 'active' : '']"
          @click="selectChannel(channel)"
        >
          # {{ channel }}
        </div>
        <div class="add-channel">
          <input v-model="newChannel" placeholder="قناة جديدة..." @keyup.enter="addChannel" />
          <button @click="addChannel">+</button>
        </div>
      </div>

      <!-- المحادثة -->
      <div class="messages-container">
        <div class="messages" ref="messagesRef">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['message', message.sender_id === currentEmployee?.id ? 'mine' : 'others']"
          >
            <span class="sender">{{ message.sender?.name }}</span>
            <p>{{ message.message }}</p>
            <span class="time">{{ formatTime(message.created_at) }}</span>
          </div>
        </div>

        <!-- حقل الإرسال -->
        <div class="input-area">
          <input
            v-model="newMessage"
            placeholder="اكتب رسالة..."
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage">إرسال ➤</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import api from '../../api/axios'
import { useAuthStore } from '../../stores/auth'

let pollingInterval: ReturnType<typeof setInterval> | null = null
const authStore = useAuthStore()
const currentEmployee = authStore.employee

const messages = ref([])
const channels = ref(['عام', 'الإدارة', 'المشاريع'])
const activeChannel = ref('عام')
const newMessage = ref('')
const newChannel = ref('')
const messagesRef = ref<HTMLElement | null>(null)

const fetchMessages = async () => {
  const response = await api.get(`/messages?channel=${activeChannel.value}`)
  messages.value = response.data
  await nextTick()
  scrollToBottom()
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  await api.post('/messages', {
    message: newMessage.value,
    channel: activeChannel.value,
  })
  newMessage.value = ''
  fetchMessages()
}

const selectChannel = (channel: string) => {
  activeChannel.value = channel
  fetchMessages()
}

const addChannel = () => {
  if (newChannel.value.trim()) {
    channels.value.push(newChannel.value.trim())
    newChannel.value = ''
  }
}

const scrollToBottom = () => {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchMessages()
  pollingInterval = setInterval(fetchMessages, 5000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<style scoped>
.chat {
  padding: 20px;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.chat-container {
  display: flex;
  gap: 16px;
  flex: 1;
  overflow: hidden;
}

.channels {
  width: 200px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.channels h3 {
  margin-bottom: 12px;
  color: #333;
}

.channel-item {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  margin-bottom: 4px;
}

.channel-item:hover,
.channel-item.active {
  background: #e3f2fd;
  color: #1a73e8;
}

.add-channel {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.add-channel input {
  flex: 1;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  direction: rtl;
}

.add-channel button {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.messages-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.message {
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 12px;
}

.message.mine {
  align-self: flex-end;
  background: #1a73e8;
  color: white;
}

.message.others {
  align-self: flex-start;
  background: #f5f5f5;
  color: #333;
}

.sender {
  font-size: 11px;
  opacity: 0.7;
  display: block;
  margin-bottom: 4px;
}

.time {
  font-size: 10px;
  opacity: 0.7;
  display: block;
  margin-top: 4px;
  text-align: left;
}

.input-area {
  display: flex;
  gap: 8px;
}

.input-area input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  direction: rtl;
}

.input-area button {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
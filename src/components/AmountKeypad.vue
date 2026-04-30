<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const keys = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['.', '0', '⌫']
]

function handleKey(key) {
  let val = props.modelValue

  if (key === '⌫') {
    emit('update:modelValue', val.slice(0, -1))
    return
  }

  if (key === '.') {
    if (val.includes('.')) return
    if (val === '') {
      emit('update:modelValue', '0.')
      return
    }
  }

  if (val.includes('.')) {
    const decimals = val.split('.')[1]
    if (decimals && decimals.length >= 2) return
  }

  if (val === '0' && key !== '.' && !val.includes('.')) {
    val = ''
  }

  emit('update:modelValue', val + key)
}
</script>

<template>
  <div class="keypad">
    <div class="amount-display">
      <span class="currency">¥</span>
      <span class="amount" :class="{ empty: !modelValue }">{{ modelValue || '0.00' }}</span>
    </div>
    <div class="keys-grid">
      <template v-for="(row, ri) in keys" :key="ri">
        <button
          v-for="key in row"
          :key="key"
          class="key-btn"
          :class="{ backspace: key === '⌫', zero: key === '0' }"
          @click="handleKey(key)"
        >
          {{ key }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.keypad {
  padding: 0 16px;
}

.amount-display {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  padding: 20px 8px 16px;
  gap: 4px;
}

.currency {
  font-size: 22px;
  color: var(--text-muted);
  font-weight: 300;
}

.amount {
  font-family: 'Noto Serif SC', serif;
  font-size: 40px;
  font-weight: 700;
  color: var(--text-primary);
  min-width: 80px;
  text-align: right;
  letter-spacing: -1px;
}

.amount.empty {
  color: var(--text-muted);
  opacity: 0.4;
}

.keys-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.key-btn {
  height: 50px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
  box-shadow: var(--shadow-sm);
}

.key-btn:active {
  background: var(--bg-tertiary);
  transform: scale(0.95);
  box-shadow: none;
}

.key-btn.backspace {
  font-size: 18px;
  color: var(--text-muted);
}
</style>

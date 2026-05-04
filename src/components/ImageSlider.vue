<template>
  <div v-if="images.length > 0" class="slider-wrap">
    <!-- Главна снимка -->
    <div class="slider-main">
      <img :src="images[current]" :alt="`Снимка ${current + 1}`" class="slider-img" />

      <!-- Стрелки (само ако има >1 снимка) -->
      <template v-if="images.length > 1">
        <button class="slider-arrow left" @click="prev">&#8249;</button>
        <button class="slider-arrow right" @click="next">&#8250;</button>
        <div class="slider-counter">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </div>

    <!-- Dots -->
    <div v-if="images.length > 1" class="slider-dots">
      <button
        v-for="(img, idx) in images"
        :key="idx"
        class="dot"
        :class="{ active: idx === current }"
        @click="current = idx"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] }
})

const current = ref(0)

function prev() {
  current.value = (current.value - 1 + props.images.length) % props.images.length
}
function next() {
  current.value = (current.value + 1) % props.images.length
}
</script>

<style scoped>
.slider-wrap {
  margin-bottom: 1.5rem;
}
.slider-main {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f0f3;
  aspect-ratio: 16/9;
}
.slider-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.25s;
}
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.85);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: background 0.15s, transform 0.15s;
  z-index: 2;
}
.slider-arrow:hover {
  background: #fff;
  transform: translateY(-50%) scale(1.08);
}
.slider-arrow.left  { left: 10px; }
.slider-arrow.right { right: 10px; }
.slider-counter {
  position: absolute;
  bottom: 10px;
  right: 12px;
  background: rgba(0,0,0,0.45);
  color: #fff;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 20px;
}
.slider-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: #ddd;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  padding: 0;
}
.dot.active {
  background: #e0559a;
  transform: scale(1.3);
}
</style>

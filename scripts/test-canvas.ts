// scripts/test-canvas.ts

import { createCanvas } from 'canvas'

const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')

ctx.fillStyle = '#FF6B6B'
ctx.fillRect(0, 0, 200, 200)

ctx.fillStyle = '#FFFFFF'
ctx.font = 'bold 30px Arial'
ctx.fillText('Test!', 50, 100)

console.log('✅ Canvas is working!')
console.log('Canvas buffer size:', canvas.toBuffer().length, 'bytes')
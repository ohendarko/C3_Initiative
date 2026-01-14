// scripts/check-image-size.ts

import sharp from 'sharp'
import path from 'path'

const imagePath = path.join(process.cwd(), 'public', 'images', 'sample-cert.png')

sharp(imagePath)
  .metadata()
  .then(metadata => {
    console.log('Certificate dimensions:')
    console.log('Width:', metadata.width)
    console.log('Height:', metadata.height)
  })
  .catch(err => {
    console.error('Error:', err)
  })
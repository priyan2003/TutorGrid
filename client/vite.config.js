import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
   theme: {
      extend: {
        fontSize :{
          'course-details-heading-small':['26px','36px'],
          'course-details-heading-large':['32px','44px'],
          'home-heading-small':['28px','34px'],
          'home-heading-large':['48px','56px'],
          default: ['16px', '21px'],
        }
      }
    },
  plugins: [react(),tailwindcss()],
})

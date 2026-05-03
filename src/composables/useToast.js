import { reactive } from 'vue'

const toast = reactive({ show: false, msg: '', type: 'ok' })
let timer

export function useToast() {
  function showToast(msg, type = 'ok') {
    clearTimeout(timer)
    toast.msg = msg
    toast.type = type
    toast.show = true
    timer = setTimeout(() => { toast.show = false }, 3000)
  }
  return { toast, showToast }
}

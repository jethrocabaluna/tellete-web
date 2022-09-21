export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type InboxItem = {
  sender: string
  content: string
  createdAt: number
  lastMessage?: boolean
}

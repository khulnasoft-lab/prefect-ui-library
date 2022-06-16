
export interface INotificationResponse {
  id: string,
  created: string,
  updated: string,
  name: string,
  is_active: boolean,
  state_names: string[],
  tags: string[],
  block_document_id: string,
}
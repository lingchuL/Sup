class ChatHistoryHandler(object):
	@staticmethod
	def add_into_history(in_role: str, in_message: str, out_chat_dict_history: [dict]):
		out_chat_dict_history.append({"role": in_role, "content": in_message})
		chat_history = ""
		for chat in out_chat_dict_history:
			role = chat["role"]
			content = chat["content"]
			chat_history += f"{role}: {content}\n"
		return chat_history


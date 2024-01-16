import chromadb


class ChromadbHandler(object):
	def __init__(self):
		pass

	def is_id_in_collection(self, collection_name, id):
		client = chromadb.Client()
		collection = client.get_collection(collection_name)
		documents = collection.query(query_texts=[id])
		return len(documents) > 0


	def add_document_to_collection(self, collection_name, id, content):
		client = chromadb.Client()
		collection = client.get_collection(collection_name)

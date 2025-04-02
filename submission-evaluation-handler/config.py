from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    kafka_bootstrap_servers: str
    kafka_consumer_group_id: str
    kafka_topics: str
    
    class Config:
        env_file = ".env"

    def model_post_init(self, __context):
        # Using model_post_init instead of __init__ as this is the recommended approach
        # for Pydantic v2+
        self.kafka_topics = self.kafka_topics.split(',') if isinstance(self.kafka_topics, str) else self.kafka_topics


settings = Settings()
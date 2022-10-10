import sys
import os
from confluent_kafka import Producer
from dotenv import load_dotenv
import json
import datetime

load_dotenv()

if __name__ == '__main__':
    topic = os.environ['CLOUDKARAFKA_TOPIC'].split(",")[0]

    # https://docs.confluent.io/platform/current/clients/confluent-kafka-python/html/index.html#pythonclient-producer
    # Consumer configuration
    # See https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md
    conf = {
        'bootstrap.servers': os.environ['CLOUDKARAFKA_BROKERS']
    }

    p = Producer(**conf)
    message = { "company": "AEG","team": "marketing","data": str(datetime.datetime.now())}
    def delivery_callback(err, msg):
        if err:
            sys.stderr.write('%% Message failed delivery: %s\n' % err)
        else:
            sys.stderr.write('%% Message delivered to %s [%d]\n' %
                             (msg.topic(), msg.partition()))
        

    try:
        p.produce(topic, json.dumps(message), callback=delivery_callback) # produce a message to topic
    except BufferError as e:
        sys.stderr.write('%% Local producer queue is full (%d messages awaiting delivery): try again\n' %
                             len(p))
    p.poll(0)

    sys.stderr.write('%% Waiting for %d deliveries\n' % len(p))
    p.flush()

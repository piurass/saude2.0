FROM ubuntu:18.04

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip build-essential python3-dev \
    && rm -rf /var/lib/apt/lists/* \
    && pip3 install --upgrade setuptools \
    && pip3 install pycrypto datetime flask requests uuid

WORKDIR /app

RUN touch blockchain.json

COPY node.py .

ENV PORT=5000

CMD ["python3", "/app/node.py"]

FROM node:12
ENV YARN_VERSION 1.22.4
RUN curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json yarn.* ./
ENV HOST 35.222.24.73
ENV USERNAME megahack
ENV PASSWORD -Qh@P*T3z9k@uPvb
ENV DATABASE proto
ENV BASEURLBLOCK http://localhost:5001
ENV SendGridApiKey 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
ENV hostURL http://localhost:3333
RUN yarn install
COPY . .
COPY --chown=node:node . .
USER node
EXPOSE 3333
RUN yarn sequelize db:migrate
CMD [ "yarn", "dev" ]

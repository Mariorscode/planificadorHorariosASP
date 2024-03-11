FROM node:20

WORKDIR /app/frontend

ENV PATH /app/frontend/node_modules/.bin:$PATH


COPY package*.json ./
RUN npm install --no-cache
RUN npm install -g @angular/cli

COPY . ./app/frontend/

CMD ["ng","serve","--host","0.0.0.0"]
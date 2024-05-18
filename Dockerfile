FROM node:22-alpine3.18

WORKDIR /app
COPY app .

RUN npm install
RUN npx prisma generate
RUN npm run build

ENTRYPOINT ["/app/entrypoint.sh"]

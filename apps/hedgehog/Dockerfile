FROM node:20-alpine AS base

# Setup env variabless for yarn and nextjs
# https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production

# update dependencies, add libc6-compat and dumb-init to the base image
RUN apk update && apk upgrade && apk add --no-cache libc6-compat && apk add dumb-init

# add the user and group we'll need in our final image
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install dependencies only when needed
FROM base AS builder
WORKDIR /src

COPY . .
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable

# Set environment variables arguments to be provided during build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AUTH_HOST
ARG NEXT_PUBLIC_HEDVIG_COM
ARG NEXT_PUBLIC_HEDVIG_APP
ARG NEXT_PUBLIC_STAGING_TOOLS_ENABLED

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_AUTH_HOST=$NEXT_PUBLIC_AUTH_HOST
ENV NEXT_PUBLIC_HEDVIG_COM=$NEXT_PUBLIC_HEDVIG_COM
ENV NEXT_PUBLIC_HEDVIG_APP=$NEXT_PUBLIC_HEDVIG_APP
ENV NEXT_PUBLIC_STAGING_TOOLS_ENABLED=$NEXT_PUBLIC_STAGING_TOOLS_ENABLED


# Build the app (in standalone mode based on next.config.js)
RUN yarn codegen
RUN dumb-init -- yarn next:build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /src

# copy the public assets folder from the project as this is not included in the build process
COPY --from=builder --chown=nextjs:nodejs /src/public ./public
# copy the standalone folder inside the .next folder generated from the build process
COPY --from=builder --chown=nextjs:nodejs /src/dist/standalone ./
# copy the static folder inside the dist folder generated from the build process
COPY --from=builder --chown=nextjs:nodejs /src/dist/static ./dist/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["dumb-init","node","server.js"]

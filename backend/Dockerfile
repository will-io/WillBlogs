FROM  node:12
# Create the base image using Node V12

# Create me an app directory
# Create App Directory
#RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm ci

# Copy app source code
COPY . .

# Exports
EXPOSE 8000

# Runs  this coman upon init
CMD [ "npm","start"] 

FROM  node:12
# Create the base image using Node V12

# Create me an app directory
WORKDIR /usr/src/app

# Install app dependencies
# wildcard is used to ensure both package and lock json are copied, where npm@5+
COPY package*.json ./

RUN npm ci

# Copy the Src Code
COPY . .

# Exports to this port
EXPOSE 3000

# Runs  this coman upon init
CMD ["npm", "start"] 

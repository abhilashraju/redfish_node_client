# Use the official Node.js image as the base image
FROM node:latest
# Install the latest version of OpenSSL
RUN apt-get update && apt-get install -y openssl
RUN apt-get install -y curl iproute2

# Set the working directory
WORKDIR /app




# Install npm packages
RUN npm install express cors http-proxy-middleware path axios react-scripts


# Copy the web folder to the working directory
COPY ./web ./web



# Expose the port the app runs on
EXPOSE 3001

# Command to run the proxy.js app
CMD ["node","--trace-deprecation", "web/proxy.js"]
#CMD ["bash"]
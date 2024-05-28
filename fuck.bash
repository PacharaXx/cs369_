#!/bin/bash

# Update the instance
sudo yum update -y || sudo apt-get update -y

# Install Git
sudo yum install -y git || sudo apt-get install -y git

# Install Node.js and npm for Amazon Linux 2
sudo yum install -y nodejs npm || {
    # For Ubuntu-based instances
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs
}

# Install pm2 globally using npm
sudo npm install pm2 -g

# Go to the home directory of the current user
cd /home/ec2-user

# Clone the repository
git clone -b main https://github.com/PacharaXx/cs369_.git

# Navigate to the project directory
cd cs369_

# Start the server application using pm2
sudo pm2 start ./server/app.js

# Save the current pm2 processes
sudo pm2 save

# Ensure pm2 starts on boot
sudo pm2 startup

# Install Nginx
sudo yum install -y nginx || sudo apt-get install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Adjust permissions
sudo chmod 755 /home/ec2-user
sudo chmod -R 755 /home/ec2-user
sudo setsebool -P httpd_read_user_content 1

cd client
# Navigate to the client directory
sudo npm install
sudo npm run build

# Copy the build files to the Nginx HTML directory
sudo cp -r out/* /usr/share/nginx/html/

# Restart Nginx to reflect the changes
sudo systemctl restart nginx

# 22-23-ict-architecture-34

## Groepsleden

+ Raf Vanhhoegaerden
+ Kevin Van Rooy
+ Szymon Dziedzic

# Instructies EC2 (Debian 11)

## Voorbereiding van de applicatie op EC2

- sudo apt-get install git
- sudo apt-get install docker
- sudo apt-get install docker-compose
- sudo apt-get install npm
- sudo apt-get install postgresql

## Voorbereiding van nodige gebruikersrechten
### Docker

- sudo usermod -aG docker $(whoami)

### Docker-compose

- sudo groupadd docker-compose
- sudo usermod -aG docker-compose $(whoami)
- sudo chown root:docker-compose /usr/bin/docker-compose
- sudo chmod g+s /usr/bin/docker-compose

### Herstarten 

- sudo shutdown -r now

## Opzetten van de applicatie op EC2

- git clone git@github.com:AP-IT-GH/22-23-ict-architecture-34.git
- .env file aanmaken met correcte variabelen (zie verder)

## Starten van de applicatie op EC2

- docker-compose up --build

# Onderhoud EC2 (Debian 11)

## Starten van de applicatie op EC2

- docker-compose down --remove-orphans
- docker-compose up

# Informatie .env-variabelen

*Opgelet! De onderstaande variabelen moeten de overeenstemmende variabelen zijn van de services op aws, dns en google*

AWS toegang

    ACCESS_KEY_ID=ASIAQXJZG6BAXEPXH4O6

    SECRET_ACCESS_KEY=FAoO2OUGPxzB2n+k00eCr1Do6X073I9p+yGJ/LZa

    SESSION_TOKEN=FwoGZXIvYXdzEJT//////////wEaDCkrW3vxL20szcS9XSLMAXTy0f0z/aPJQoPsLP/G+jLUndVWdN4ZS9w2JpcNjX1rkiOXRhXl9ZMZ/NCZndt8IdJq15Cb8LjjVpgG9WJFU5jqYKVBQi7eGcQ8gNs4OMXuONEJ4p9I9/TxOSRRfMB3X60R15tDQMd0X3BV8+MQ2qcRstsRxaj4XaN43BuAS/dqYBObaaA864addlRlJkguG2p3/QZSCW8lr8ZxsLGOwpMvA6zbJk1fQN8d1kR5Hleh9TaMd1d6fDmV6LxHr6214isrkO4m4Lam6M8BmyiCvKmjBjItNkO/2rejgMTnFiUZlnSyHspSsHu6YN3kA9u9RJDZPbHKxvydxuShDLw9C+0a
    #AUTHENTICATION variables

Database

    POSTGRES_USER=randomUser

    POSTGRES_PASSWORD=randomWachtwoord

    POSTGRES_HOST=postgresOpRDSEndpoint.us-east-1.rds.amazonaws.com

    POSTGRES_DB=randomDb

    DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:5432/

SQS & S3

    SQS_URL=https://sqs.us-east-1.amazonaws.com/050048987201/resizerQueue

    BUCKET=random-bucket

    AWS_REGION=random-region-1
    
DNS

    DOMAIN_STRING=naamvaneenwebsite

    ROOT_URL=https://$DOMAIN_STRING.be

    REDIRECT_URL=https://$DOMAIN_STRING.be/auth/callback

Authenticatie
    
    SESSION_SECRET=1234567890randomcode

    CLIENT_ID=deIdVanCognito

    TOKEN_URL=https://$DOMAIN_STRING.auth.us-east-1.amazoncognito.com/oauth2/token

    USER_INFO_URL=https://$DOMAIN_STRING.auth.us-east-1.amazoncognito.com/oauth2/userInfo

    AUTH_URL=https://$DOMAIN_STRING.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=$CLIENT_ID&response_type=code&scope=email+openid+phone&redirect_uri=$REDIRECT_URL

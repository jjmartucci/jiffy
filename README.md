# Jiffy

## Environmental Variables
See the `.sample.env` file. Create one with the values for your environment and save it as `.env`, or use
[Next.JS environment specific naming](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#default-environment-variables)

## Local Dev
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Deploying with Docker

```
docker build -t nextjs-docker .
docker run -p  3000:3000 nextjs-docker
```

Complete Docker rebuild for dev:
```
docker build --pull --no-cache -t nextjs-docker .
```

## S3 Notes
You might have to configure CORS on your S3 bucket to handle upload requests. An example for Digital Ocean Spaces:
```
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>DELETE</AllowedMethod>
        <MaxAgeSeconds>3600</MaxAgeSeconds>
        <ExposeHeader>ETag</ExposeHeader>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```



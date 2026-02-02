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

## Deploying to Render

When deploying to Render (or similar PaaS), configure a persistent disk to prevent data loss:

1. Add a persistent disk mounted at `/var/data`
2. Set environment variables:
   - `DATABASE_URL=file:/var/data/jiffy.db`
   - `DB_PATH=/var/data/jiffy.db`

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

## API Routes

### GIF Routes

#### `GET /api/gif/read`
Retrieves a GIF by ID and increments view count.
- **Query:** `?id=<gifId>`
- **Response:** `{ gif }` (includes tags)

#### `POST /api/gif/update`
Updates a GIF record. Requires authentication.
- **Request:** `{ id, name, filename, description, width, height, tags[] }`
- **Response:** `{ success: true, gif }`

#### `POST /api/gif/upsert`
Creates or updates a GIF record. Requires authentication.
- **Request:** `{ id, name, filename, description, width, height, tags[] }`
- **Response:** `{ success: true, gif }`

#### `POST /api/gif/delete`
Deletes a GIF and removes the file from S3. Requires authentication.
- **Request:** `{ id }`
- **Response:** `{ success: true, gif }`

### Search Routes

#### `GET /api/search`
Full-text search across GIFs using Fuse.js. Searches name, description, and tags.
- **Query:** `?query=<searchTerm>`
- **Response:** `{ gifs, status: 200 }`

#### `GET /api/search/yolo`
Returns the first matching GIF's image URL ("I'm feeling lucky").
- **Query:** `?q=<query>`
- **Response:** `{ gif: <imageUrl>, status: 200 }`

#### `GET /api/search/autocomplete`
Returns unique GIF names for autocomplete.
- **Response:** `{ searchTerms }`

#### `POST /api/search/updateIndex`
Rebuilds the Lunr search index.
- **Response:** `{ success: true }`

### Tag Routes

#### `GET /api/prisma/tags/listAll`
Returns all tag names.
- **Response:** `{ tags: [name1, name2, ...] }`

#### `GET /api/prisma/tags/getGifsByTag`
Returns all GIFs with a specific tag.
- **Query:** `?tag=<tagId>`
- **Response:** `{ taggedGifs }`





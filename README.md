
# Create and Delete Upstash Redis


## Usage/Examples

### Create Redis DB

```yml
name: Create Upstash Redis Database

on:
  workflow_dispatch:

jobs:
  create_database:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      - name: Create Upstash Redis Database
        uses: ./
        id: create-upstash-redis
        with:
          action: "create"
          database_name: "test2"
          region: "global"
          primary_region: "eu-west-1"
          read_replica_regions: "us-east-1"
          email: ${{ secrets.UPSTASH_EMAIL }}
          api_key: ${{ secrets.UPSTASH_API_KEY }}
          tls: true
      - name: Output Database Information
        run: |
          echo "Database ID: ${{ steps.create-upstash-redis.outputs.database_id }}"
          echo "Database Name: ${{ steps.create-upstash-redis.outputs.database_name }}"
          echo "Database Type: ${{ steps.create-upstash-redis.outputs.database_type }}"
          echo "Region: ${{ steps.create-upstash-redis.outputs.region }}"
          echo "Port: ${{ steps.create-upstash-redis.outputs.port }}"
          echo "Creation Time: ${{ steps.create-upstash-redis.outputs.creation_time }}"
          echo "State: ${{ steps.create-upstash-redis.outputs.state }}"
          echo "Password: ${{ steps.create-upstash-redis.outputs.password }}"
          echo "User Email: ${{ steps.create-upstash-redis.outputs.user_email }}"
          echo "Endpoint: ${{ steps.create-upstash-redis.outputs.endpoint }}"
          echo "Redis Endpoint: ${{ steps.create-upstash-redis.outputs.redis_endpoint }}"

```

### Delete Redis DB

```yml
name: Delete Upstash Redis Database

on:
  workflow_dispatch:

jobs:
  delete_database:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      - name: Delete Upstash Redis Database
        uses: ./
        id: delete-upstash-redis
        with:
          action: "delete"
          database_name: "test2"
          email: ${{ secrets.UPSTASH_EMAIL }}
          api_key: ${{ secrets.UPSTASH_API_KEY }}
```
## More Info
To get more about usage you can take a look at workflow examples in .github/workflows directory.
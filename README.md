
# Create and Delete Upstash Redis

## Actions Inputs

### `action`

**Required**: true  
**Description**: Action to perform (create/delete)

#### `database_name`

**Required**: false  
**Description**: The database name

#### `region`

**Required**: false  
**Description**: The region

#### `primary_region`

**Required**: false  
**Description**: The primary region

#### `read_replica_regions`

**Required**: false  
**Description**: The read replica regions separated by comma

#### `email`

**Required**: true  
**Description**: The Upstash account email

#### `api_key`

**Required**: true  
**Description**: The Upstash API key

#### `tls`

**Required**: false  
**Description**: Whether to use TLS  
**Default**: true

## Action Outputs ["create"]

#### `database_id`

**Description**: The database id

#### `database_name`

**Description**: The database name

#### `database_type`

**Description**: The database type

#### `region`

**Description**: The region

#### `port`

**Description**: The port

#### `creation_time`

**Description**: The creation time

#### `state`

**Description**: The state

#### `password`

**Description**: The password

#### `user_email`

**Description**: The user email

#### `endpoint`

**Description**: The endpoint

#### `tls`

**Description**: Whether to use TLS

#### `rest_token`

**Description**: The rest token

#### `read_only_rest_token`

**Description**: The read only rest token

#### `redis_endpoint`

**Description**: The direct redis endpoint for TCP connection. Example "redis://user:pass@my-redis-url.com:6379"


---

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
        uses: saurabh-git-dev/upstash-redis@v1.0.0
        id: create-upstash-redis
        with:
          action: "create"
          database_name: "test-db"
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
        uses: saurabh-git-dev/upstash-redis@v1.0.0
        id: delete-upstash-redis
        with:
          action: "delete"
          database_name: "test-db"
          email: ${{ secrets.UPSTASH_EMAIL }}
          api_key: ${{ secrets.UPSTASH_API_KEY }}
```

In this example, the action is used to create a new Upstash Redis instance named 'test-db' in the global with read replicas and TLS enabled. Make sure to replace `secrets.UPSTASH_EMAIL` and `secrets.UPSTASH_API_KEY` with your actual secrets in your repository settings.

## More Info
To get more about usage you can take a look at workflow examples in .github/workflows directory.

To know more about inputs/outputs values you can visit [Upstash Docs](https://upstash.com/docs/devops/developer-api/redis/create_database)
import { getInput, setFailed, setOutput, setSecret } from "@actions/core";
import axios from "axios";

const upstashUsername = getInput('email');
const upstashAPI = getInput('api_key');
const action = getInput('action');

if (!upstashUsername || !upstashAPI) {
    throw new Error("Email and API key are required");
}

const BASE_URL = "https://api.upstash.com";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    auth: {
        username: upstashUsername,
        password: upstashAPI
    },
    validateStatus: () => true,
});

const createDatabase = async (name: string, region: string, primary_region?: string, read_regions?: string[], tls: boolean = true) => {
    const response = await axiosInstance.post("/v2/redis/database", {
        name,
        region,
        primary_region,
        read_regions,
        tls
    });
    return response;
};

const getDatabaseFromName = async (name: string) => {
    const response = await axiosInstance.get("/v2/redis/databases");

    if (response.status !== 200) {
        throw new Error("Failed to fetch databases: " + JSON.stringify(response.data));
    }

    const list = response.data;
    const db = list.find((db: any) => db.database_name === name);
    return db;
};

const deleteDatabase = async (name: string) => {
    const db = await getDatabaseFromName(name);
    if (!db) {
        return;
    }
    const res = await axiosInstance.delete(`/v2/redis/database/${db.database_id}`);
    return res;
};

const setOutputs = (db: any) => {
    if (db) {
        // mask the password, redis endpoint and rest tokens
        const redisEndpoint = `redis://default:${db.password}@${db.endpoint}:${db.port}`;

        setSecret(db.password);
        setSecret(redisEndpoint);
        setSecret(db.rest_token);
        setSecret(db.read_only_rest_token);

        setOutput('database_id', db.database_id);
        setOutput('database_name', db.database_name);
        setOutput('database_type', db.database_type);
        setOutput('region', db.region);
        setOutput('port', db.port);
        setOutput('creation_time', db.creation_time);
        setOutput('state', db.state);
        setOutput('password', db.password);
        setOutput('user_email', db.user_email);
        setOutput('endpoint', db.endpoint);
        setOutput('tls', db.tls);
        setOutput('rest_token', db.rest_token);
        setOutput('read_only_rest_token', db.read_only_rest_token);
        setOutput('redis_endpoint', redisEndpoint);

    }
}

const main = async () => {
    if (action === "create") {
        try {
            const name = getInput('database_name');
            const region = getInput('region');
            const primary_region = getInput('primary_region');
            const read_regions = getInput('read_regions')?.split(",");
    
            if (!name || !region) {
                throw new Error("Name and region are required");
            }
    
            if (region === 'global' && !primary_region) {
                throw new Error("Primary region is required for global region");
            }
    
            const tls = getInput('tls') === "true";
    
            const res = await createDatabase(name, region, primary_region, read_regions, tls);

            if (res.status === 200) {
                console.log("Database created successfully");
                setOutputs(res.data);
                return;
            } 
    
            if (res.status === 400 && res.data === "database with same name already exists") {
                console.log("Database already exists");
                try {
                    const db = await getDatabaseFromName(name);
                    if (db) {
                        console.log("Database retrieved successfully")
                        setOutputs(db);
                        return;
                    } else {
                        throw new Error("No database found with the name: " + name + ". But it exists");
                    }
                } catch (error) {
                    console.log(error)
                    throw new Error("Database already exists. But could not fetch it.");
                }
            } else {
                throw new Error("Invalid request: " + JSON.stringify(res.data));
            }
        } catch (error: any) {
            setFailed("Failed to create database: " + JSON.stringify(error?.data || error?.message));
        }

    } else if (action === "delete") {
        const name = getInput('database_name');
        try {
            const res = await deleteDatabase(name);

            if (res?.status === 200) {
                console.log("Database deleted successfully");
                return;
            } else if (res?.status === 404 && res?.data === "database not found") {
                console.error("Failed to delete database response: " + JSON.stringify(res?.data));
            } else {
                setFailed("Failed to delete database: " + JSON.stringify(res?.data));
            }
        } catch (error) {
            setFailed("Failed to delete database");
        }
    } else {
        throw new Error("Invalid action");
    }
};

main();
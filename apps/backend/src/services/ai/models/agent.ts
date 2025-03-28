import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import weaviate, { WeaviateClient } from "weaviate-ts-client";

// TODO: setup weaviate local instance

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
// Initialize Google Gemini Flash 2 API
const genAI = new GoogleGenerativeAI(apiKey ?? "");

const client: WeaviateClient = weaviate.client({
  scheme: "http",
  host: "localhost:3002",
});

console.log(client);

// Sample employee CVs
const employeeCVs = [
  {
    name: "Alice",
    role: "Frontend Developer",
    skills: ["React", "Keycloak", "JavaScript", "HTML", "CSS"],
    projects: ["Developed custom Keycloak templates for authentication flows."],
  },
  {
    name: "Bob",
    role: "Backend Developer",
    skills: ["Node.js", "Express", "MongoDB", "Auth0"],
    projects: ["Built authentication microservices."],
  },
];

// Function to upload CVs to Weaviate
async function uploadCVs() {
  for (const cv of employeeCVs) {
    await client.data
      .creator()
      .withClassName("Employee")
      .withProperties({
        name: cv.name,
        role: cv.role,
        skills: cv.skills.join(", "),
        projects: cv.projects.join(", "),
      })
      .do();
  }
  console.log("CVs uploaded to Weaviate!");
}

// Function to search for relevant employees
async function searchEmployees(query: string) {
  const response = await client.graphql
    .get()
    .withClassName("Employee")
    .withFields("name role skills projects")
    .withNearText({ concepts: [query] })
    .withLimit(3)
    .do();

  return response.data.Get.Employee;
}

// Function to generate an answer using Gemini
async function querySkills(question: string) {
  const relevantEmployees = await searchEmployees(question);

  const context = relevantEmployees
    .map(
      (emp: any) =>
        `Name: ${emp.name}\nRole: ${emp.role}\nSkills: ${emp.skills}\nProjects: ${emp.projects}`
    )
    .join("\n\n");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Given the following employee database:\n${context}\n\nAnswer the question: ${question}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Example Query
(async () => {
  await uploadCVs(); // Run this once to upload CVs
  const query = "Who can understand Keycloak custom templates in React?";
  const answer = await querySkills(query);
  console.log(answer);
})();

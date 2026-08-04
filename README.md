# Engineering Data Management System (EDMS)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)
![Drizzle](https://img.shields.io/badge/ORM-Drizzle-C5F74F)
![License](https://img.shields.io/badge/License-MIT-blue)

A full-stack web application developed during my Software Engineering Internship at **PT. Infoglobal Teknologi Semesta** to centralize engineering data management and improve product traceability through hierarchical visualization.

The system manages **Part Numbers**, **Drawing Numbers**, and **Document Numbers** while providing engineering-oriented features such as **Parent-Child Relationships**, **Tree Visualization**, and **Configuration Management** for aerospace and defense manufacturing workflows.

---

## Overview

Engineering products often consist of hundreds or even thousands of interconnected components. Managing those components using spreadsheets and documents makes it difficult to maintain consistency, understand product structures, and perform engineering traceability.

This project transforms that manual workflow into a centralized Engineering Data Management System that enables engineers to organize engineering data, visualize hierarchical relationships, and manage supporting documents through a modern web application.

---

# Problem Statement

Before this system was developed, engineering data was managed manually using Microsoft Word and Excel.

This created several operational challenges:

- Engineering data was scattered across multiple files.
- Searching for engineering documents was time-consuming.
- Duplicate numbering could occur.
- Product structures were difficult to understand.
- Relationships between engineering components were not visualized.
- Engineering traceability relied heavily on manual verification.

This application was developed to solve those problems through centralized data management and hierarchical engineering visualization.

---

# Core Features

## Engineering Data Management

Manage three primary engineering entities:

- Part Number
- Drawing Number
- Document Number

Each module provides complete CRUD functionality together with searching, validation, and document management.

---

## Parent-Child Relationship

Engineering components can be connected using parent-child relationships to represent real product assemblies.

Instead of storing isolated records, the system models how components are connected within an engineering structure.

This becomes the foundation for engineering traceability and configuration management.

---

## Tree Visualization

One of the key features of this application is the ability to visualize engineering relationships as a hierarchical tree.

```
Aircraft
├── Wing Assembly
│   ├── Motor
│   ├── Sensor
│   └── PCB
└── Cockpit
    ├── Display
    └── Controller
```

Compared to traditional tables, this visualization makes complex engineering structures significantly easier to understand.

---

## Engineering Traceability

The system allows engineers to navigate relationships between engineering entities, making it easier to:

- inspect product structures
- analyze dependencies
- verify engineering configurations
- perform traceability across assemblies

---

## Engineering Document Management

Each engineering entity can store related technical documents, including:

- Engineering Drawings
- PDF Specifications
- Datasheets
- Supporting Documents

Binary files are stored separately from relational data using cloud object storage.

---

## Automatic Validation

The application validates engineering numbering to reduce manual errors and prevent duplicate records before they are stored.

---

# Technical Highlights

Unlike a conventional CRUD application, this project implements several software engineering concepts.

### Hierarchical Data Modeling

Engineering products are represented using parent-child relationships, allowing complex assemblies to be modeled naturally.

---

### Tree Data Structure

A tree data structure is used to build hierarchical engineering visualization and simplify navigation across engineering components.

---

### Engineering Traceability

Relationships between engineering entities enable engineers to trace product structures from parent assemblies down to individual components.

---

### Configuration Management

The application helps maintain consistent engineering configurations by preserving relationships between engineering data.

---

### RESTful Architecture

Frontend and backend are fully separated and communicate through REST APIs using JSON.

---

### Cloud-Based File Storage

Structured engineering data and engineering documents are stored independently.

- PostgreSQL stores metadata.
- Supabase Storage stores engineering documents.

This architecture keeps the database lightweight while improving scalability.

---

# System Architecture

```
                    Client

             React + Vite Frontend
                     │
                REST API (JSON)
                     │
            Express.js + Node.js
                     │
         ┌───────────┴───────────┐
         │                       │
 PostgreSQL (Neon)      Supabase Storage
 Engineering Data      Engineering Documents
```

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React, Vite, JavaScript, Bootstrap |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon Database) |
| ORM | Drizzle ORM |
| Storage | Supabase Storage |
| Authentication | JSON Web Token (JWT) |
| API | REST API |
| Version Control | Git, GitHub |

---

# Project Structure

```
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── schema/
│   ├── db/
│   └── utils/
│
└── README.md
```

---

# Engineering Concepts Applied

This project applies multiple software engineering and product lifecycle concepts, including:

- Engineering Data Management (EDM)
- Product Traceability
- Configuration Management
- Parent–Child Relationship
- Tree Data Structure
- Hierarchical Visualization
- Relational Database Design
- RESTful API Design
- Cloud Object Storage
- Authentication & Authorization

---

# Why This Project Matters

This project goes beyond a traditional management system by modeling engineering data as interconnected structures rather than isolated records.

By combining hierarchical data modeling, tree visualization, engineering traceability, and cloud-based document management, the application provides a more efficient way to organize engineering information within manufacturing environments.

---

# Future Improvements

Potential enhancements include:

- Bill of Materials (BOM) Management
- Engineering Change Management (ECM)
- Revision History
- Role-Based Access Control (RBAC)
- Audit Logs
- Full Product Lifecycle Management (PLM) Integration
- Advanced Search & Filtering
- Engineering Analytics Dashboard

---

# Author

**Muhammad Yusran Yuris**

Information Systems Undergraduate  
Universitas Airlangga

Software Engineering Internship Project at **PT Infoglobal Teknologi Semesta**
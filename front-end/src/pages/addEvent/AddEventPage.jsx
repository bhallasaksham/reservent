import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Spinner, Button, Card } from "react-bootstrap";
import styles from "./AddEventPage.module.css";

export const AddEventPage = () => {
  return (
    <MainLayout>
      <h1 className="page-title">Add New Event</h1>
    </MainLayout>
  );
};

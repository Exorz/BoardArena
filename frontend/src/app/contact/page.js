// Exempel för /src/app/contact/page.js
"use client";
import styles from '../../styles/contact.module.css';

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.</p>
      <form className={styles.contactForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>Message:</label>
          <textarea id="message" name="message" className={styles.textarea} rows="5" required></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>Send Message</button>
      </form>
    </main>
  );
}

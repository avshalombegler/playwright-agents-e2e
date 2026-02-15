/**
 * Enhanced test data management with dynamic generation and role-based access
 */
export interface User {
  username: string;
  password: string;
  email?: string;
  role?: 'admin' | 'user' | 'guest';
}

export interface TestCredentials {
  valid: User;
  invalid: User;
}

export class TestDataManager {
  /**
   * Get predefined user by role
   */
  static getUser(role: 'admin' | 'user' | 'guest'): User {
    const users = {
      admin: { 
        username: 'admin', 
        password: 'admin', 
        email: 'admin@example.com',
        role: 'admin' as const
      },
      user: { 
        username: 'tomsmith', 
        password: 'SuperSecretPassword!', 
        email: 'tomsmith@example.com',
        role: 'user' as const
      },
      guest: { 
        username: 'guest', 
        password: 'guest', 
        email: 'guest@example.com',
        role: 'guest' as const
      }
    };
    return users[role];
  }

  /**
   * Get authentication credentials for different auth types
   */
  static getAuthCredentials(type: 'basic' | 'digest' = 'basic'): TestCredentials {
    return {
      valid: { username: 'admin', password: 'admin' },
      invalid: { username: 'invalid', password: 'invalid' }
    };
  }

  /**
   * Generate random email address
   */
  static generateRandomEmail(domain: string = 'example.com'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `test.${timestamp}.${random}@${domain}`;
  }

  /**
   * Generate random username
   */
  static generateRandomUsername(prefix: string = 'user'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Generate random password with specific requirements
   */
  static generateRandomPassword(
    length: number = 12,
    includeSpecialChars: boolean = true
  ): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = lowercase + uppercase + numbers;
    if (includeSpecialChars) {
      chars += specialChars;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  }

  /**
   * Get test data for form validation
   */
  static getFormValidationData() {
    return {
      valid: {
        email: this.generateRandomEmail(),
        username: this.generateRandomUsername(),
        password: this.generateRandomPassword()
      },
      invalid: {
        emails: ['invalid-email', '@example.com', 'test@', ''],
        usernames: ['', ' ', 'a', 'user with spaces'],
        passwords: ['', '123', 'weak']
      },
      edge: {
        longEmail: `${'a'.repeat(50)}@${'b'.repeat(50)}.com`,
        longUsername: 'a'.repeat(100),
        longPassword: 'a'.repeat(200)
      }
    };
  }

  /**
   * Get file upload test data
   */
  static getFileUploadData() {
    return {
      validFiles: {
        image: { name: 'test-image.jpg', type: 'image/jpeg' },
        document: { name: 'test-doc.pdf', type: 'application/pdf' },
        text: { name: 'test-file.txt', type: 'text/plain' }
      },
      invalidFiles: {
        executable: { name: 'malicious.exe', type: 'application/x-executable' },
        oversized: { name: 'large-file.zip', type: 'application/zip' }
      }
    };
  }

  /**
   * Get URL patterns for testing
   */
  static getUrlPatterns() {
    return {
      login: '/login',
      secure: '/secure',
      basicAuth: '/basic_auth',
      digestAuth: '/digest_auth',
      download: '/download',
      upload: '/upload',
      forgotPassword: '/forgot_password'
    };
  }

  /**
   * Create test data for bulk operations
   */
  static createBulkUsers(count: number, role: 'admin' | 'user' | 'guest' = 'user'): User[] {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      users.push({
        username: this.generateRandomUsername(`${role}_${i}`),
        password: this.generateRandomPassword(),
        email: this.generateRandomEmail(),
        role
      });
    }
    return users;
  }
}
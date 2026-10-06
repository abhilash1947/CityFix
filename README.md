# CivicConnect - Civic Issue Reporting Platform

A comprehensive web application that enables citizens to report municipal issues and allows authorities to manage and track their resolution.

## Features

### For Citizens
- **Issue Reporting**: Report civic issues with photos, GPS location, and detailed descriptions
- **Status Tracking**: Monitor the progress of reported issues in real-time
- **Category System**: Categorize issues (Roads, Waste Management, Water Supply, Electricity, Public Safety, Others)
- **User Dashboard**: Personal dashboard to view all submitted reports and their status

### For Municipal Authorities
- **Authority Dashboard**: Comprehensive view of all reported issues
- **Issue Management**: Update issue status, add comments, and upload resolution photos
- **Analytics**: View statistics and trends across different categories and locations
- **Filtering & Search**: Advanced filtering by category, status, urgency, and location

### Authentication & Security
- **User Registration**: Email-based registration with role selection (Citizen/Authority)
- **Secure Login**: Password-protected accounts with "remember me" functionality
- **Password Recovery**: Reset forgotten passwords via email
- **Role-based Access**: Different interfaces for citizens and authorities

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for consistent iconography
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage for issue photos
- **Build Tool**: Vite for fast development and building

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd civic-connect
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure your Supabase credentials in `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up the database schema (run these SQL commands in your Supabase SQL editor)

6. Start the development server
```bash
npm run dev
```

## Database Schema

The application uses the following main tables:

- `users`: User profiles and authentication data
- `issues`: Civic issue reports with location, photos, and status
- `status_updates`: History of status changes with comments

## Usage

### For Citizens
1. Register for an account as a "Citizen"
2. Navigate to "Report Issue" to submit new civic issues
3. Use the dashboard to track your submitted issues
4. Receive notifications when status updates occur

### For Authorities
1. Register with "Municipal Authority" role
2. Access the authority dashboard to view all issues
3. Filter issues by category, status, or urgency
4. Update issue status and add resolution comments
5. Upload before/after photos for resolved issues

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const WellnessResource = require('../models/WellnessResourceModel');
const PersonalizedRecommendation = require('../models/PersonalizedRecommendationModel');
const User = require('../models/userModel');

// Real wellness resources based on the surveys
const resources = [
  {
    resourceTitle: 'Mindfulness at Work: Reducing Stress',
    resourceCategory: 'Mental Health',
    resourceURL: 'https://www.mindful.org/mindfulness-at-work/',
  },
  {
    resourceTitle: 'How to Maintain Work-Life Balance',
    resourceCategory: 'Work-Life Balance',
    resourceURL: 'https://www.helpguide.org/articles/stress/work-life-balance.htm',
  },
  {
    resourceTitle: 'Team Collaboration Best Practices',
    resourceCategory: 'Team Collaboration',
    resourceURL: 'https://www.atlassian.com/software/confluence/team-collaboration',
  },
  {
    resourceTitle: 'Employee Engagement Strategies',
    resourceCategory: 'Employee Engagement',
    resourceURL: 'https://www.gallup.com/workplace/285674/improve-employee-engagement-workplace.aspx',
  },
  {
    resourceTitle: 'Managing Workplace Stress',
    resourceCategory: 'Mental Health',
    resourceURL: 'https://www.verywellmind.com/managing-stress-in-the-workplace-3144606',
  },
  {
    resourceTitle: 'The Importance of Recognition at Work',
    resourceCategory: 'Job Satisfaction',
    resourceURL: 'https://www.forbes.com/sites/jacquelynsmith/2013/06/24/why-recognition-is-so-important-in-the-workplace/',
  },
  {
    resourceTitle: 'Effective Communication in Teams',
    resourceCategory: 'Team Communication',
    resourceURL: 'https://www.mindtools.com/CommSkll/CommunicationIntro.htm',
  },
  {
    resourceTitle: 'Improving Mental Health with Meditation',
    resourceCategory: 'Mental Health',
    resourceURL: 'https://www.healthline.com/health/mental-health/mindfulness-meditation',
  },
  {
    resourceTitle: 'Career Growth: How to Stay Motivated',
    resourceCategory: 'Career Growth',
    resourceURL: 'https://www.themuse.com/advice/9-ways-to-stay-motivated-at-work',
  },
  {
    resourceTitle: 'Job Satisfaction: Enhancing Your Role',
    resourceCategory: 'Job Satisfaction',
    resourceURL: 'https://www.shrm.org/resourcesandtools/hr-topics/employee-relations/pages/job-satisfaction.aspx',
  },
];

// Real personalized recommendations based on surveys
const recommendations = [
  {
    recommendationText: 'Consider practicing mindfulness meditation to reduce stress. It’s been shown to help employees manage workloads effectively.',
    resourceUrl: 'https://www.mindful.org/mindfulness-at-work/',
  },
  {
    recommendationText: 'Work on your communication skills to improve team collaboration. Check out these best practices.',
    resourceUrl: 'https://www.atlassian.com/software/confluence/team-collaboration',
  },
  {
    recommendationText: 'Recognizing employees for their work can greatly increase job satisfaction and motivation. Learn more about the importance of recognition.',
    resourceUrl: 'https://www.forbes.com/sites/jacquelynsmith/2013/06/24/why-recognition-is-so-important-in-the-workplace/',
  },
  {
    recommendationText: 'It’s important to maintain work-life balance. Explore strategies to manage your time effectively and stay healthy.',
    resourceUrl: 'https://www.helpguide.org/articles/stress/work-life-balance.htm',
  },
  {
    recommendationText: 'If stress is affecting your performance, try guided meditation exercises to improve mental clarity.',
    resourceUrl: 'https://www.healthline.com/health/mental-health/mindfulness-meditation',
  },
  {
    recommendationText: 'Need help with team communication? Consider using tools like Confluence to streamline your work.',
    resourceUrl: 'https://www.atlassian.com/software/confluence/team-collaboration',
  },
  {
    recommendationText: 'Feeling disengaged? Explore ways to grow your career and keep yourself motivated.',
    resourceUrl: 'https://www.themuse.com/advice/9-ways-to-stay-motivated-at-work',
  },
  {
    recommendationText: 'You mentioned stress from deadlines. Try using stress management techniques such as prioritization and time-blocking.',
    resourceUrl: 'https://www.verywellmind.com/managing-stress-in-the-workplace-3144606',
  },
  {
    recommendationText: 'To improve your work-life balance, consider setting strict boundaries between work and personal time.',
    resourceUrl: 'https://www.helpguide.org/articles/stress/work-life-balance.htm',
  },
  {
    recommendationText: 'You could benefit from improved team collaboration tools. This guide may help your team work more effectively.',
    resourceUrl: 'https://www.mindtools.com/CommSkll/CommunicationIntro.htm',
  },
];

// Seed function to add resources and recommendations
const seedData = async () => {
  try {
    await connectDB();

    // Find or create the User (Adjust the email to match a real user from your database)
    const user = await User.findOne({ email: 'obada.kraishan@gmail.com' });
    if (!user) {
      console.log('User not found, please add a valid user.');
      process.exit(1);
    }

    // Seed resources
    const createdResources = await WellnessResource.insertMany(
      resources.map((resource) => ({ ...resource, createdBy: user._id }))
    );
    console.log('Resources seeded:', createdResources);

    // Seed recommendations (add employeeId to recommendations)
    for (const recommendation of recommendations) {
      const newRecommendation = new PersonalizedRecommendation({
        ...recommendation,
        employeeId: user._id,
      });
      await newRecommendation.save();
      console.log('Recommendation seeded:', newRecommendation);
    }

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

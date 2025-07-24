import React from 'react';
import {
  Card,
  Text,
  Title,
  Grid,
  Box,
  Flex,
  ThemeIcon,
  Progress
} from '@mantine/core';
import { 
  IconUsers,
  IconAlertTriangle,
  IconShield,
  IconTrendingUp
} from '@tabler/icons-react';

const StatisticsCards = ({ households }) => {
  const stats = {
    total: households.length,
    high: households.filter(h => h.riskLevel === 'High').length,
    moderate: households.filter(h => h.riskLevel === 'Moderate').length,
    low: households.filter(h => h.riskLevel === 'Low').length,
    avgIncome: households.reduce((sum, h) => sum + h.familyIncome, 0) / households.length || 0
  };

  const cardData = [
    {
      title: 'Total Households',
      value: stats.total,
      icon: IconUsers,
      color: 'red',
      bgGradient: 'from-white to-red-50',
      iconGradient: 'from-red-500 to-red-600',
      progressValue: 100,
      progressColor: 'red'
    },
    {
      title: 'High Risk',
      value: stats.high,
      icon: IconAlertTriangle,
      color: 'red',
      bgGradient: 'from-white to-red-50',
      iconGradient: 'from-red-600 to-red-700',
      progressValue: (stats.high / stats.total) * 100,
      progressColor: 'red'
    },
    {
      title: 'Moderate Risk',
      value: stats.moderate,
      icon: IconShield,
      color: 'yellow',
      bgGradient: 'from-white to-yellow-50',
      iconGradient: 'from-yellow-500 to-orange-500',
      progressValue: (stats.moderate / stats.total) * 100,
      progressColor: 'yellow'
    },
    {
      title: 'Average Income',
      value: `₱${Math.round(stats.avgIncome).toLocaleString()}`,
      icon: IconTrendingUp,
      color: 'green',
      bgGradient: 'from-white to-green-50',
      iconGradient: 'from-green-500 to-emerald-500',
      progressValue: 75,
      progressColor: 'green'
    }
  ];

  return (
    <Grid mb={40} gutter="xl">
      {cardData.map((card, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
          <Card className={`bg-gradient-to-br ${card.bgGradient} shadow-xl border-0 h-full transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}>
            <Flex align="center" gap="lg">
              <ThemeIcon size={60} className={`bg-gradient-to-br ${card.iconGradient} shadow-lg`}>
                <card.icon size={28} className="text-white" />
              </ThemeIcon>
              <Box>
                <Text size="sm" className="text-gray-600 font-semibold uppercase tracking-wide">
                  {card.title}
                </Text>
                <Title order={1} className={`text-3xl font-bold text-${card.color}-600`}>
                  {card.value}
                </Title>
                <Progress 
                  value={card.progressValue} 
                  size="xs" 
                  className="mt-2" 
                  color={card.progressColor} 
                />
              </Box>
            </Flex>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default StatisticsCards;
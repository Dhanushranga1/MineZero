// pages/emissions.js
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Stack, FormControl, FormLabel, Select, Input, Button, Text, Heading, Collapse, Fade, useToast, Icon, useDisclosure, Grid, GridItem, Divider, useTheme, Tooltip as ChakraTooltip } from '@chakra-ui/react';
import { MdCalculate, MdDashboard } from 'react-icons/md';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CSVLink } from 'react-csv';
import { useRouter } from 'next/router';

// Emission factors and offsets
const emissionFactors = {
  'surface-mining': {
    blasting: 0.5,
    excavation: 1.0,
    transportation: 0.3,
  },
  'underground-mining': {
    roomAndPillar: 0.7,
    longwall: 0.9,
    subLevelCaving: 0.6,
  },
};

const carbonOffsets = {
  treePlanting: 0.1, // kg CO2 absorbed per tree per year
  solarPanels: 0.12, // kg CO2 offset per kWh of solar energy
};

const costPerKgCO2 = 10; // Local cost of carbon offset in rupees per kg CO2

const EmissionCalculator = () => {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [selectedActivity, setSelectedActivity] = useState('');
  const [result, setResult] = useState(null);
  const [date, setDate] = useState(new Date());
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const [carbonTrends, setCarbonTrends] = useState(null);
  const router = useRouter();

  const onSubmit = (data) => {
    if (!selectedActivity) {
      toast({
        title: "Select a mining activity.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const emissionData = emissionFactors[selectedActivity];
    if (!emissionData) return;

    const totalEmissions = Object.keys(emissionData).reduce((total, key) => {
      const value = parseFloat(data[key] || 0);
      return total + (value * emissionData[key]);
    }, 0);

    const treesRequired = Math.ceil(totalEmissions / carbonOffsets.treePlanting);
    const solarPanelsRequired = Math.ceil(totalEmissions / carbonOffsets.solarPanels);

    const emissionsAfterTreeOffset = totalEmissions - (treesRequired * carbonOffsets.treePlanting);
    const emissionsAfterSolarOffset = totalEmissions - (solarPanelsRequired * carbonOffsets.solarPanels);

    const costOfEmissions = totalEmissions * costPerKgCO2;

    setResult({
      totalEmissions,
      emissions: emissionData,
      data: Object.keys(emissionData).map(process => ({
        name: process.replace(/([A-Z])/g, ' $1').toUpperCase(),
        value: (parseFloat(data[process] || 0) * emissionData[process])
      })),
      treesRequired,
      solarPanelsRequired,
      emissionsAfterTreeOffset,
      emissionsAfterSolarOffset,
      costOfEmissions
    });

    setCarbonTrends([
      { name: 'Total Emissions', value: totalEmissions },
      { name: 'Emissions After Tree Offset', value: emissionsAfterTreeOffset },
      { name: 'Emissions After Solar Offset', value: emissionsAfterSolarOffset }
    ]);

    onToggle(); // Show results
  };

  const handleActivityChange = (e) => {
    const activity = e.target.value;
    setSelectedActivity(activity);
    reset(); // Clear previous inputs
  };

  const renderProcesses = () => {
    if (!selectedActivity) return null;

    const processes = Object.keys(emissionFactors[selectedActivity]);

    return processes.map(process => (
      <FormControl key={process} isInvalid={errors[process]}>
        <FormLabel htmlFor={process} color="teal.600" fontSize="md" fontWeight="medium">
          {process.replace(/([A-Z])/g, ' $1').toUpperCase()} (unit)
        </FormLabel>
        <Input
          id={process}
          type="number"
          step="any"
          {...register(process, { valueAsNumber: true })}
          fontSize="md"
          p={4}
          bg="white"
          borderColor="teal.500"
          borderRadius="md"
          placeholder={`Enter amount in appropriate unit`}
        />
        {errors[process] && <Text color="red.500" fontSize="sm">{errors[process].message}</Text>}
      </FormControl>
    ));
  };

  return (
    <Box
      p={8}
      bg="linear-gradient(135deg, #e0f7fa 0%, #b9fbc0 100%)"
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      color="gray.800"
      boxShadow="md"
    >
      <Heading mb={6} textAlign="center" color="teal.800" fontSize="4xl" fontWeight="bold">Coal Mining Emissions Calculator</Heading>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} width="full" maxW="1200px">
        <GridItem bg="white" p={8} rounded="lg" shadow="lg" border="1px" borderColor="gray.300">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={6}>
              <FormControl>
                <FormLabel htmlFor="date" color="teal.700" fontSize="md" fontWeight="medium">Date</FormLabel>
                <Calendar
                  onChange={setDate}
                  value={date}
                  minDate={new Date(2020, 0, 1)}
                  maxDate={new Date()}
                />
                <Text color="teal.700" fontSize="md">Selected Date: {date.toDateString()}</Text>
              </FormControl>

              <FormControl isInvalid={errors.activity}>
                <FormLabel htmlFor="activity" color="teal.700" fontSize="md" fontWeight="medium">Select Mining Activity</FormLabel>
                <Select
                  id="activity"
                  placeholder="Select mining activity"
                  {...register('activity', { required: 'This field is required' })}
                  onChange={handleActivityChange}
                  value={selectedActivity}
                  fontSize="md"
                  bg="white"
                  borderColor="teal.500"
                  borderRadius="md"
                  _hover={{ borderColor: "teal.600" }}
                >
                  <option value="surface-mining">Surface Mining</option>
                  <option value="underground-mining">Underground Mining</option>
                </Select>
                {errors.activity && <Text color="red.500" fontSize="sm">{errors.activity.message}</Text>}
              </FormControl>

              {renderProcesses()}

              <Button
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
                leftIcon={<Icon as={MdCalculate} />}
                fontSize="lg"
                borderRadius="md"
                _hover={{ bg: "teal.600" }}
              >
                Calculate Emissions
              </Button>
            </Stack>
          </form>
        </GridItem>

        <GridItem bg="white" p={8} rounded="lg" shadow="lg" border="1px" borderColor="gray.300">
          <Collapse in={isOpen}>
            <Fade in={result !== null}>
              <Box>
                <Heading size="md" mb={6} textAlign="center" color="teal.800">Results</Heading>
                {result && (
                  <Stack spacing={6}>
                    <Text fontSize="lg" fontWeight="bold">
                      <strong>Total Emissions:</strong> {result.totalEmissions.toFixed(2)} kg CO2
                    </Text>
                    
                    <Box>
                      <Heading size="sm" mb={4} color="teal.600">Emission Breakdown</Heading>
                      <PieChart width={400} height={400}>
                        <Pie data={result.data} dataKey="value" nameKey="name" outerRadius={150} fill="#82ca9d">
                          {result.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </Box>

                    <Box>
                      <Heading size="sm" mb={4} color="teal.600">Carbon Footprint Trends</Heading>
                      <BarChart width={600} height={300} data={carbonTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </Box>

                    <Box mt={6} p={4} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
                      <Heading size="md" mb={4} color="teal.800">Offset Options</Heading>
                      <Stack spacing={4}>
                        <FormControl>
                          <FormLabel htmlFor="treePlanting" color="teal.600" fontSize="md" fontWeight="medium">Trees Required for Offset</FormLabel>
                          <Input
                            id="treePlanting"
                            type="number"
                            value={result.treesRequired}
                            fontSize="md"
                            p={4}
                            bg="white"
                            borderColor="teal.500"
                            borderRadius="md"
                            isReadOnly
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel htmlFor="solarPanels" color="teal.600" fontSize="md" fontWeight="medium">Solar Panels Required for Offset</FormLabel>
                          <Input
                            id="solarPanels"
                            type="number"
                            value={result.solarPanelsRequired}
                            fontSize="md"
                            p={4}
                            bg="white"
                            borderColor="teal.500"
                            borderRadius="md"
                            isReadOnly
                          />
                        </FormControl>

                        <Text fontSize="lg">Emissions After Tree Offset: {result.emissionsAfterTreeOffset.toFixed(2)} kg CO2</Text>
                        <Text fontSize="lg">Emissions After Solar Offset: {result.emissionsAfterSolarOffset.toFixed(2)} kg CO2</Text>
                        <Text fontSize="lg">Cost of Emissions: ₹{result.costOfEmissions.toFixed(2)}</Text>
                      </Stack>
                    </Box>

                    <Button as={CSVLink} data={result.data} filename="emissions-data.csv" colorScheme="teal" leftIcon={<Icon as={MdCalculate} />} fontSize="lg" borderRadius="md" _hover={{ bg: "teal.600" }}>
                      Download Data
                    </Button>
                    
                    <Button onClick={() => router.push('/')} colorScheme="teal" leftIcon={<Icon as={MdDashboard} />} fontSize="lg" borderRadius="md" _hover={{ bg: "teal.600" }}>
                      Back to Dashboard
                    </Button>
                  </Stack>
                )}
              </Box>
            </Fade>
          </Collapse>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default EmissionCalculator;

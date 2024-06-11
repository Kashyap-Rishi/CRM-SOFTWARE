import React, { useContext } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  Theme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { AllLogDataContext } from "../../hooks/AllLogContext";
import { AllCustomerDataContext } from "../../hooks/AllCustomerContext";

const Statistics: React.FC = () => {
  const contextLogValue = useContext(AllLogDataContext);
  const contextCustomerValue = useContext(AllCustomerDataContext);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  if (
    !contextLogValue ||
    !contextLogValue.data ||
    !contextCustomerValue ||
    !contextCustomerValue.data
  ) {
    return <div>Loading...</div>;
  }

  const { data: campaigns } = contextLogValue;
  const { data: customers } = contextCustomerValue;

  const totalCampaignsSent = campaigns.filter(
    (campaign) => campaign.campaignStatus === "SENT"
  ).length;

  const totalSuccessfullyDelivered = campaigns.reduce((acc, campaign) => {
    return (
      acc +
      campaign.customers.filter(
        (customer: any) => customer.status === "SUCCESS"
      ).length
    );
  }, 0);

  const uniqueRegisteredUsers = customers.length;

  const totalPendingCampaigns = campaigns.filter(
    (campaign) => campaign.campaignStatus === "PENDING"
  ).length;

  const monthlyCampaignsSent = campaigns.reduce((acc, campaign) => {
    const month = new Date(campaign.createdAt).toLocaleString("default", {
      month: "short",
    });
    const existingMonth = acc.find((item: any) => item.name === month);
    if (existingMonth) {
      existingMonth.campaigns += 1;
    } else {
      acc.push({ name: month, campaigns: 1 });
    }
    return acc;
  }, [] as { name: string; campaigns: number }[]);

  const dailyVisits = customers.reduce(
    (acc, customer) => acc + customer.maxVisits,
    0
  );

  const totalSpendsData = customers.map((customer) => ({
    name: customer.name,
    totalSpends: customer.totalSpends,
  }));

  return (
    <div>
      <h2
        style={{
          lineHeight: isMobile ? "1.2" : "1.5",
          fontSize: isMobile ? "1.5rem" : "2rem",
        }}
      >
        CRM STATISTICS
      </h2>
      <Grid container spacing={3}>
        {[
          { title: "Campaigns Sent", value: totalCampaignsSent },
          {
            title: "Successfully Delivered",
            value: totalSuccessfullyDelivered,
          },
          { title: "Registered Users", value: uniqueRegisteredUsers },
          { title: "Pending Campaigns", value: totalPendingCampaigns },
          { title: "Daily Visits", value: dailyVisits },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  align="center"
                  style={{
                    fontSize: isMobile ? "1.5rem" : "1.2rem",
                    marginBottom: "8px",
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="h4"
                  align="center"
                  style={{ fontSize: isMobile ? "2rem" : "2.5rem" }}
                >
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container marginTop={5} spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyCampaignsSent}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="campaigns" fill="#7AB2B2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={totalSpendsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalSpends"
                    stroke="#7AB2B2"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Statistics;

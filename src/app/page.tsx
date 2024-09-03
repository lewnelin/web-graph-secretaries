'use client'

import React, { useState } from 'react'
import { Button, Card, CardContent, Typography, Box } from '@mui/material'
import { styled } from '@mui/system'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type SalesData = {
  month: string
  sales: number
}

const Input = styled('input')({
  display: 'none',
})

export default function FileUploadChart() {
  const [chartData, setChartData] = useState<SalesData[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split('\n')
        const data: SalesData[] = lines.slice(1).map(line => {
          const [month, sales] = line.split(',')
          return { month, sales: Number(sales) }
        })
        setChartData(data)
      }
      reader.readAsText(file)
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Grafico de Secretarias',
      },
    },
  }

  const data = {
    labels: chartData.map(item => item.month),
    datasets: [
      {
        label: 'Secretarias',
        data: chartData.map(item => item.sales),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100vh', bgcolor: 'grey.100', p: 2, gap: 2 }}>
      <Card sx={{ width: { xs: '100%', md: '30%' } }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Carregar arquivo
          </Typography>
          <Input
            accept=".csv"
            id="contained-button-file"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" component="span" fullWidth>
              Selecionar Arquivo CSV
            </Button>
          </label>
        </CardContent>
      </Card>
      <Card sx={{ width: { xs: '100%', md: '70%' } }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
          Grafico de Secretarias
          </Typography>
          {chartData.length > 0 ? (
            <Bar options={chartOptions} data={data} />
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              Carregue um arquivo CSV para ver o gráfico
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
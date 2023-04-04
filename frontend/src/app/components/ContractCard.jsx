'use client';

import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

export default function ContractCard({ header, body, footer }) {
  return (
    <Card>
      <CardHeader>{header}</CardHeader>
      <CardBody>{body}</CardBody>
      <CardFooter>{footer}</CardFooter>
    </Card>
  )
}
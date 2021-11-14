import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
    res: NextApiResponse
    ) {
      const session = await getSession({ req });

        const { id } = req.query;
          const { name } = session.user;

            const entry = await prisma.service.findUnique({
                where: {
                      id: Number(id)
                          }
                            });

                              if (req.method === 'GET') {
                                  return res.json({
                                        id: entry.id.toString(),
                                              body: entry.body,
                                                    created_by: entry.created_by,
                                                          updated_at: entry.updated_at
                                                              });
                                                                }

                                                                  if (!name || name !== entry.created_by) {
                                                                      return res.status(403).send('Unauthorized');
                                                                        }

                                                                          if (req.method === 'DELETE') {
                                                                              await prisma.service.delete({
                                                                                    where: {
                                                                                            id: Number(id)
                                                                                                  }
                                                                                                      });

                                                                                                          return res.status(204).json({});
                                                                                                            }

                                                                                                              if (req.method === 'PUT') {
                                                                                                                  const body = (req.body.body || '').slice(0, 500);

                                                                                                                      await prisma.service.update({
                                                                                                                            where: {
                                                                                                                                    id: Number(id)
                                                                                                                                          },
                                                                                                                                                data: {
                                                                                                                                                        body,
                                                                                                                                                                updated_at: new Date().toISOString()
                                                                                                                                                                      }
                                                                                                                                                                          });

                                                                                                                                                                              return res.status(201).json({
                                                                                                                                                                                    ...entry,
                                                                                                                                                                                          body
                                                                                                                                                                                              });
                                                                                                                                                                                                }

                                                                                                                                                                                                  return res.send('Method not allowed.');
                                                                                                                                                                                                  }

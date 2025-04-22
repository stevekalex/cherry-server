// // src/routes/userRoutes.ts
// import { Router, Request, Response } from 'express';
// import {
// //   createUser,
//   findUserByGoogleId,
//   updateUser,
//   deleteUser,
// } from '../services/user';

// export const userRouter = Router();

// // Create
// userRouter.post('/', async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;
//     const user = await createUser(payload);
//     res.status(201).json(user);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Read
// userRouter.get('/:id', async (req: Request, res: Response) => {
//   try {
//     const user = await getUserById(req.params.id);
//     if (!user) return res.sendStatus(404);
//     res.json(user);
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Read
// userRouter.get('/:google_id', async (req: Request, res: Response) => {
//     try {
//       const user = await findUserByGoogleId(req.params.id);
//       if (!user) return res.sendStatus(404);
//       res.json(user);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

// // Update
// userRouter.put('/:id', async (req: Request, res: Response) => {
//   try {
//     const updates = req.body as UpdateUser;
//     const user = await updateUser(req.params.id, updates);
//     res.json(user);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Delete
// userRouter.delete('/:id', async (req: Request, res: Response) => {
//   try {
//     await deleteUser(req.params.id);
//     res.sendStatus(204);
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// });

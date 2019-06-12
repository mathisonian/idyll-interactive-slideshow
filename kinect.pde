/*
Based on code from:

Thomas Sanchez Lengeling.
 http://codigogenerativo.com/

 KinectPV2, Kinect for Windows v2 library for processing
 */

import java.util.ArrayList;
import KinectPV2.KJoint;
import KinectPV2.*;
import java.nio.FloatBuffer;
KinectPV2 kinect;

import websockets.*;

WebsocketClient wsc;

int lastHandState = -1;
int clickStateCount = 0;

ArrayList<PVector> planePoints = new ArrayList<PVector>();

void setup() {
  size(512, 424, P3D);
  wsc= new WebsocketClient(this, "ws://5a5fd427.ngrok.io");

  kinect = new KinectPV2(this);

  //Enables depth and Body tracking (mask image)
  //kinect.enableDepthMaskImg(true);
  kinect.enableDepthImg(true);
  kinect.enablePointCloud(true);
  kinect.enableSkeleton3DMap(true);
  kinect.enableColorImg(true);
  kinect.enableCameraSpaceTable(true);

  kinect.init();
}

void draw() {
  background(0);

  //image(kinect.getDepthImage(), 0, 0);
  image(kinect.getColorImage(), 0, 0, 512, 424);

  //get the skeletons as an Arraylist of KSkeletons
  ArrayList<KSkeleton> skeletonArray =  kinect.getSkeleton3d();

  //println(skeletonArray);
  //individual joints
  for (int i = 0; i < skeletonArray.size(); i++) {
    KSkeleton skeleton = (KSkeleton) skeletonArray.get(i);
    //if the skeleton is being tracked compute the skleton joints
    if (skeleton.isTracked()) {
      KJoint[] joints = skeleton.getJoints();

      color col  = skeleton.getIndexColor();
      //fill(col);
      //stroke(col);

      drawBody(joints);
      //drawHandState(joints[KinectPV2.JointType_HandRight]);
      //drawHandState(joints[KinectPV2.JointType_HandLeft]);

      KJoint elbow = joints[KinectPV2.JointType_ElbowRight];
      KJoint wrist = joints[KinectPV2.JointType_WristRight];

      //println(elbow.getX(), elbow.getY(), elbow.getZ());
      PVector elbowVec = new PVector(elbow.getX(), elbow.getY(), elbow.getZ());
      PVector wristVec = new PVector(wrist.getX(), wrist.getY(), wrist.getZ());

      //println(elbowVec);
      drawRay(elbowVec, new PVector(wristVec.x * 10 - elbowVec.x, wristVec.y * 10 - elbowVec.y, wristVec.z * 10 - elbowVec.z), 10, 50);

      if(planePoints.size() == 3) {
        PVector intersection = findIntersectionPoint(elbowVec, wristVec, planePoints.get(0), planePoints.get(1), planePoints.get(2));
        if (intersection != null) {
          //println("not null!");

          PVector depthSpace = kinect.MapCameraPointToDepthSpace(intersection);
          //println(intersection);
          //println(depthSpace);
          fill(#ffffff);
          ellipse(depthSpace.x, depthSpace.y, 25, 25);

          PVector normalizedScreen = intersectionToScreen(intersection);

          wsc.sendMessage("{ \"name\": \"highlight\", \"x\":" + normalizedScreen.x + ", \"y\":" + normalizedScreen.y + " }");

        } else {
          println("no intersection!");
        }
      }

      handleHandState(joints[KinectPV2.JointType_HandRight].getState());
    }
  }

  fill(255, 0, 0);
  text(frameRate, 50, 50);

  //if(planePoints.size() == 3) {
  for (int i =0; i < planePoints.size(); i++) {
    PVector point = planePoints.get(i);

    //PVector depthSpace = kinect.MapCameraPointToDepthSpace(point);

    //println("Depth space");
    //println(depthSpace);
    //pushMatrix();
    //println(point.x, point.y, point.z);
    //translate(point.x, point.y, point.z);
    PVector depthSpace = kinect.MapCameraPointToDepthSpace(point);

    ellipse(depthSpace.x, depthSpace.y, 25, 25);
    //popMatrix();
  }
  //}

}

void handleHandState(int handState) {
  if (handState == KinectPV2.HandState_NotTracked || handState == KinectPV2.HandState_Lasso) {
    return;
  }
  if (handState == KinectPV2.HandState_Closed) {
    if (lastHandState != handState) {
      clickStateCount = 0;
    }

    clickStateCount += 1;
    if (clickStateCount == 3) {
    //  println("Click!");
      wsc.sendMessage("{ \"name\": \"click\", \"direction\": \"down\" }");
    }
  } else if (handState == KinectPV2.HandState_Open && lastHandState != handState) {
    println("Click up!");
    wsc.sendMessage("{ \"name\": \"click\", \"direction\": \"up\" }");

  }
  lastHandState = handState;
}

//draw the body
void drawBody(KJoint[] joints) {
  //drawBone(joints, KinectPV2.JointType_Head, KinectPV2.JointType_Neck);
  //drawBone(joints, KinectPV2.JointType_Neck, KinectPV2.JointType_SpineShoulder);
  //drawBone(joints, KinectPV2.JointType_SpineShoulder, KinectPV2.JointType_SpineMid);
  //drawBone(joints, KinectPV2.JointType_SpineMid, KinectPV2.JointType_SpineBase);
  //drawBone(joints, KinectPV2.JointType_SpineShoulder, KinectPV2.JointType_ShoulderRight);
  //drawBone(joints, KinectPV2.JointType_SpineShoulder, KinectPV2.JointType_ShoulderLeft);
  //drawBone(joints, KinectPV2.JointType_SpineBase, KinectPV2.JointType_HipRight);
  //drawBone(joints, KinectPV2.JointType_SpineBase, KinectPV2.JointType_HipLeft);

  //// Right Arm
  //drawBone(joints, KinectPV2.JointType_ShoulderRight, KinectPV2.JointType_ElbowRight);
  //drawBone(joints, KinectPV2.JointType_ElbowRight, KinectPV2.JointType_WristRight);
  //drawBone(joints, KinectPV2.JointType_WristRight, KinectPV2.JointType_HandRight);
  //drawBone(joints, KinectPV2.JointType_HandRight, KinectPV2.JointType_HandTipRight);
  //drawBone(joints, KinectPV2.JointType_WristRight, KinectPV2.JointType_ThumbRight);

  //// Left Arm
  //drawBone(joints, KinectPV2.JointType_ShoulderLeft, KinectPV2.JointType_ElbowLeft);
  //drawBone(joints, KinectPV2.JointType_ElbowLeft, KinectPV2.JointType_WristLeft);
  //drawBone(joints, KinectPV2.JointType_WristLeft, KinectPV2.JointType_HandLeft);
  //drawBone(joints, KinectPV2.JointType_HandLeft, KinectPV2.JointType_HandTipLeft);
  //drawBone(joints, KinectPV2.JointType_WristLeft, KinectPV2.JointType_ThumbLeft);

  //// Right Leg
  //drawBone(joints, KinectPV2.JointType_HipRight, KinectPV2.JointType_KneeRight);
  //drawBone(joints, KinectPV2.JointType_KneeRight, KinectPV2.JointType_AnkleRight);
  //drawBone(joints, KinectPV2.JointType_AnkleRight, KinectPV2.JointType_FootRight);

  //// Left Leg
  //drawBone(joints, KinectPV2.JointType_HipLeft, KinectPV2.JointType_KneeLeft);
  //drawBone(joints, KinectPV2.JointType_KneeLeft, KinectPV2.JointType_AnkleLeft);
  //drawBone(joints, KinectPV2.JointType_AnkleLeft, KinectPV2.JointType_FootLeft);

  //Single joints
  //drawJoint(joints, KinectPV2.JointType_HandTipLeft);
  //drawJoint(joints, KinectPV2.JointType_HandTipRight);
  //drawJoint(joints, KinectPV2.JointType_FootLeft);
  //drawJoint(joints, KinectPV2.JointType_FootRight);

  //drawJoint(joints, KinectPV2.JointType_ThumbLeft);
  //drawJoint(joints, KinectPV2.JointType_ThumbRight);


  drawJoint(joints, KinectPV2.JointType_ElbowRight, #0000ff);
  drawJoint(joints, KinectPV2.JointType_WristRight, #00ff00);

  //KJoint elbow = joints[KinectPV2.JointType_ElbowRight];
  //KJoint wrist = joints[KinectPV2.JointType_WristRight];

  //drawJoint(joints, KinectPV2.JointType_Head);
}

//draw a single joint
void drawJoint(KJoint[] joints, int jointType, color c) {
  fill(c);
  KJoint joint = joints[jointType];
  PVector depthSpace = kinect.MapCameraPointToDepthSpace(new PVector(joint.getX(), joint.getY(), joint.getZ()));
  //pushMatrix();
  //println(depthSpace);
  //translate(joints[jointType].getX(), joints[jointType].getY(), joints[jointType].getZ());
  //println(depthSpace);
  ellipse(depthSpace.x, depthSpace.y, 10, 10);
  //popMatrix();
}

//draw a bone from two joints
void drawBone(KJoint[] joints, int jointType1, int jointType2) {
  KJoint joint = joints[jointType1];
  KJoint joint2 = joints[jointType2];
  PVector depthSpace = kinect.MapCameraPointToDepthSpace(new PVector(joint.getX(), joint.getY(), joint.getZ()));
  PVector depthSpace2 = kinect.MapCameraPointToDepthSpace(new PVector(joint2.getX(), joint2.getY(), joint2.getZ()));

  //pushMatrix();
  //translate(joints[jointType1].getX(), joints[jointType1].getY(), joints[jointType1].getZ());
  //ellipse(0, 0, 25, 25);
  //popMatrix()
  line(depthSpace.x, depthSpace.y, depthSpace2.x, depthSpace2.y );
}

//draw a ellipse depending on the hand state
void drawHandState(KJoint joint) {
  //noStroke();
  //handState(joint.getState());
  //pushMatrix();
  //translate(joint.getX(), joint.getY(), joint.getZ());
  //ellipse(0, 0, 70, 70);
  //popMatrix();
}

/*
Different hand state
 KinectPV2.HandState_Open
 KinectPV2.HandState_Closed
 KinectPV2.HandState_Lasso
 KinectPV2.HandState_NotTracked
 */

//Depending on the hand state change the color
//void handState(int handState) {
//  switch(handState) {
//  case KinectPV2.HandState_Open:
//    fill(0, 255, 0);
//    break;
//  case KinectPV2.HandState_Closed:
//    fill(255, 0, 0);
//    break;
//  case KinectPV2.HandState_Lasso:
//    fill(0, 0, 255);
//    break;
//  case KinectPV2.HandState_NotTracked:
//    fill(100, 100, 100);
//    break;
//  }
//}


void mouseClicked() {
  //if (planePoints.size() < 3) {



    FloatBuffer dtc = kinect.getDepthToCameraSpaceTable();

    int [] rawData = kinect.getRawDepthData();
    int idx = mouseY * 512 + mouseX;

    float z = rawData[idx];

    float x = dtc.get(2 * idx) * z;
    float y = dtc.get(2 * idx + 1) * z;

    //println(x, y, z);

    //FloatBuffer dtc = kinect.getPointCloudDepthPos();


    //for (int i = 0; i < 512; i++) {
    //  for (int j = 0; j < 424; j++) {
    //    int k = j * 512 + i;
    //    println(dtc.get(k), dtc.get(k + 1), dtc.get(k + 2));
    //  }
    //}



    //float x = dtc.get(idx);
    //float y = dtc.get(idx + 1);
    //float z = dtc.get(idx + 2);

    //ellipse(depthSpace.x, depthSpace.y, 20, 20);

    //println(x);
    //println(y);
    //println(z);

    //////values for [0 - 256] strip
    ////int [] rawData256 = kinect.getRawDepth256Data();
    ////println(rawData256[mouseY * 512 + mouseX]);

    planePoints.add(new PVector(x, y, z));
  //}
}

void drawRay(PVector origin, PVector direction, float step, int iterations) {

  float dx = direction.x * direction.x / abs(direction.x);
  float dy = direction.y * direction.y / abs(direction.y);
  float dz = direction.z * direction.z / abs(direction.z);

  float avgDepth = 0;
  for (int i = 0; i < planePoints.size(); i++) {
    PVector planePoint = planePoints.get(i);
    avgDepth += planePoint.z;
  }
  avgDepth /= planePoints.size();

  //println(dz, step, origin.z, avgDepth, origin.x, origin.y, origin.z, dx, dy, dz);
  for (int i = 0; i < iterations; i++) {
    float x = origin.x + dx * step * i;
    float y = origin.y + dy * step * i;
    float z = origin.z + dz * step * i;
    PVector depthSpace = kinect.MapCameraPointToDepthSpace(new PVector(x, y, z));

    //pushMatrix();
    //translate(origin.x + i * step * (direction.x), origin.y + i * step * (direction.y), origin.y + i * step * (direction.y));
    //translate(x, y, z);
    fill(#dddddd);
    if (z > avgDepth) {
      //println("Over average depth");
      fill(#0000ff);
    ellipse(depthSpace.x, depthSpace.y, 10, 10);
    return;
    }
    ellipse(depthSpace.x, depthSpace.y, map(z, 0, 2000, 10, 0), map(z, 0, 2000, 10, 0));
    //popMatrix();
  }
}


PVector findIntersectionPoint(PVector rayOrigin, PVector rayDirection, PVector planeA, PVector planeB, PVector planeC) {

  // Pre-processing.
  // Assume that we go top-left, bottom-left, bottom right
  //
  float averageZ = (planeA.z + planeB.z + planeC.z) / 3.0;
  float averageLX = (planeA.x + planeB.x) / 2.0;
  float averageBY = (planeB.y + planeC.y) / 2.0;

  planeA.z = averageZ;
  planeB.z = averageZ;
  planeC.z = averageZ;
  planeA.x = averageLX;
  planeB.x = averageLX;
  planeB.y = averageBY;
  planeC.y = averageBY;

  // Start matrix math
  PVector cross1 = PVector.sub(planeA, planeB);
  PVector cross2 = PVector.sub(planeB, planeC);

  PVector planeNormal = new PVector();
  cross1.cross(cross2, planeNormal);

  float numerator = PVector.dot(planeNormal, planeA) - PVector.dot(planeNormal, rayOrigin);
  float denominator = PVector.dot(planeNormal, rayDirection);

  if (denominator != 0.0) {
    float t = numerator / denominator;
    if (t < 0) {
      return null;
    }
    PVector result = PVector.add(rayOrigin, PVector.mult(rayDirection, t));
    return result;
  }

  return null;
}

PVector intersectionToScreen(PVector intersection) {
  float minX = Float.POSITIVE_INFINITY;
  float maxX = Float.NEGATIVE_INFINITY;
  float minY = Float.POSITIVE_INFINITY;
  float maxY = Float.NEGATIVE_INFINITY;
  for (int i = 0; i < planePoints.size(); i++) {
    PVector planePoint = planePoints.get(i);
    float x = planePoint.x;
    float y = planePoint.y;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  float normalizedX = (intersection.x - minX) / (maxX - minX);
  float normalizedY = (intersection.y - minY) / (maxY - minY);

  return new PVector(normalizedX, normalizedY);
}

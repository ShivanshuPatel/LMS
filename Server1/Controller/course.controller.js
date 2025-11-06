import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { deleteMediaFromCloudinary } from "../utils/cloudinary.js";
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Course title and category is required.",
      });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.userId,
    });
    return res.status(201).json({
      course,
      message: "Course Created.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};

// export const searchCourse = async (req, res) => {
//   try {
//     let { query = "", categories = "", sortByPrice = "" } = req.query;

//     // Convert categories string into array if it exists
//     const categoryArray = categories ? categories.split(",") : [];

//     // Step 1: Build search filter
//     const searchCriteria = {
//       isPublished: true,
//       $or: [
//         { courseTitle: { $regex: query, $options: "i" } },
//         { subTitle: { $regex: query, $options: "i" } },
//         { category: { $regex: query, $options: "i" } },
//       ],
//     };

//     // Step 2: If specific categories selected
//     if (categoryArray.length > 0) {
//       searchCriteria.category = { $in: categoryArray };
//     }

//     // Step 3: Handle sorting
//     let sortOptions = {};
//     if (sortByPrice === "low") {
//       sortOptions.coursePrice = 1; // ascending
//     } else if (sortByPrice === "high") {
//       sortOptions.coursePrice = -1; // descending
//     }

//     // Step 4: Find and sort
//     const courses = await Course.find(searchCriteria)
//       .sort(sortOptions)
//       .populate({
//         path: "creator",
//         select: "name photoUrl",
//       });

//     return res.status(200).json({
//       success: true,
//       courses: courses || [],
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Failed to search course",
//     });
//   }
// };

export const searchCourse = async (req, res) => {
  try {
    let { query = "", categories = "", sortByPrice = "" } = req.query;
    const categoryArray = categories ? categories.split(",") : [];

    // Step 1: Base search
    let searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    // Step 2: Add categories filter (case-insensitive)
    if (categoryArray.length > 0) {
      searchCriteria.$and = [
        {
          $or: categoryArray.map((cat) => ({
            category: { $regex: cat, $options: "i" },
          })),
        },
      ];
    }

    // Step 3: Sorting
    const sortOptions = {};
    if (sortByPrice === "low") sortOptions.coursePrice = 1;
    else if (sortByPrice === "high") sortOptions.coursePrice = -1;

    // Step 4: Fetch courses
    const courses = await Course.find(searchCriteria)
      .sort(sortOptions)
      .populate("creator", "name photoUrl");

    return res.status(200).json({ success: true, courses: courses || [] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to search course" });
  }
};

export const getPublishedCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });
    if (!courses) {
      return res.status(404).json({
        message: "Course Not found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to Published course",
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req?.userId;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Course not found.",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};

export const EditCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;
    const courseId = req.params.courseId;
    let course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({
        message: "Course Not Found!",
      });
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      // upload a thumbnail on cloudinary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    return res.status(200).json({
      course,
      message: "Course Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({
        message: "Course not Found!",
      });
    }
    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get course by id",
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required",
      });
    }

    // create lecture
    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(201).json({
      lecture,
      message: "Lecture Created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to Create Lecture",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log("COURSE ID ", courseId);
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      lectures: course.lectures,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to Get Lecture",
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture Not found!" });
    }
    // update Lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Ensure the course is still has the lecture id if it is was not already added
    // const course = await Course.findById(courseId);
    // if (course && course.lectures.includes(lecture._id)) {
    //   course.lectures.push(lecture._id);
    //   await course.save();
    // }
    const course = await Course.findById(courseId);
    if (course) {
      const exists = course.lectures.some(
        (id) => id.toString() === lecture._id.toString()
      );
      if (!exists) {
        course.lectures.push(lecture._id);
        await course.save();
      }
    }
    return res.status(200).json({
      message: "Lecture Added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to Edit Lecture",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }

    // delete the lecture from cloundinary as well
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    // Remove the lecture reference from the associated course
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } } // ✅ Correct plural field name
    );
    return res.status(200).json({
      message: "Lecture removed successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to remove Lecture.",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get Lecture by id .",
    });
  }
};

// publish and unpublish course logic
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; //true , false
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    // publish status based on the query parameter
    course.isPublished = publish === "true";
    await course.save();
    const statusMessage = course.isPublished ? " Published" : "UnPublished";
    return res.status(200).json({
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to Update status ",
    });
  }
};
